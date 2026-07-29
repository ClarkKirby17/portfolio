import { Suspense, useEffect, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AmbientBackdrop, BackToTop, CursorSpotlight, ScrollProgress } from './Chrome';
import { ChatLauncher } from '@/components/chat/ChatLauncher';
import { EASE_SMOOTH } from '@/lib/utils';

/** Router keeps scroll position on navigation; a new page should start at the top. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

/** Minimal fallback while a lazily-loaded route chunk arrives. */
function RouteFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-fog-50/15 border-t-accent-bright" />
    </div>
  );
}

/** Wraps each route so navigation fades rather than snaps. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_SMOOTH }}
    >
      {children}
    </motion.div>
  );
}

export function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <ScrollProgress />
      <AmbientBackdrop />
      <CursorSpotlight />
      <Navbar />
      <ScrollToTop />

      <main id="main" className="relative z-10 pt-18">
        <Suspense fallback={<RouteFallback />}>
          {/* Keying on pathname restarts the entrance animation per route. */}
          <PageTransition key={pathname}>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>

      <Footer />
      <BackToTop />
      <ChatLauncher />
    </>
  );
}
