import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { profile } from '@/data/profile';
import { cn, EASE_SMOOTH } from '@/lib/utils';

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Experience', to: '/experience' },
  { label: 'Resume', to: '/resume' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // The bar only gains its border and blur after leaving the hero, so the
  // top of the page reads as one uninterrupted surface.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the sheet on navigation, and lock the page behind it while open.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        scrolled
          ? 'border-b border-fog-50/[0.07] bg-ink-950/70 backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        {/* Logo: the monogram uses the display serif, the only place it appears small. */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-lg"
          aria-label={`${profile.name}, home`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-accent/30 bg-accent/10 font-display text-lg text-accent-bright transition-colors duration-300 group-hover:border-accent-bright/50 group-hover:bg-accent/20">
            C
          </span>
          <span className="hidden font-medium tracking-tight text-fog-50 sm:block">
            Clark Normor
          </span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative block rounded-lg px-3.5 py-2 text-sm transition-colors duration-200',
                    isActive ? 'text-fog-50' : 'text-fog-300 hover:text-fog-50',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {/* One shared layoutId makes the underline slide between
                        items instead of fading out and in. */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-bright"
                        transition={{ duration: 0.4, ease: EASE_SMOOTH }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={profile.links.resume} download>
              <Download className="h-4 w-4" aria-hidden />
              Resume
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-xl text-fog-300 transition-colors hover:bg-fog-50/[0.06] hover:text-fog-50 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-0 z-50 bg-ink-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-18 items-center justify-end px-5 sm:px-8">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-xl text-fog-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex flex-col gap-1 px-5 pt-6 sm:px-8">
              {navigation.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.4, ease: EASE_SMOOTH }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-baseline gap-4 border-b border-fog-50/[0.07] py-4 font-display text-3xl tracking-tight transition-colors',
                        isActive ? 'text-accent-bright' : 'text-fog-50',
                      )
                    }
                  >
                    <span className="font-mono text-xs text-fog-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="px-5 pt-8 sm:px-8">
              <Button asChild size="lg" className="w-full">
                <a href={profile.links.resume} download>
                  <Download className="h-4 w-4" aria-hidden />
                  Download resume
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
