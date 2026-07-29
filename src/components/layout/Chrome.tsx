import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Small persistent pieces of page chrome. Grouped in one file because they
 * are all decorative, all mounted once in the layout, and none is big enough
 * to justify its own module.
 */

/** A one-pixel accent line across the top showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-accent-bright to-accent"
    />
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 8 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          /* Sits above the assistant bubble in the same corner stack. */
          className="glass-strong fixed bottom-24 right-5 z-40 grid h-11 w-11 place-items-center rounded-full text-fog-300 transition-colors hover:text-accent-bright sm:right-8"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * A very soft green light that trails the cursor. Deliberately weak: it is
 * atmosphere, not a feature. Skipped entirely on touch devices and for anyone
 * who prefers reduced motion, and it writes to CSS variables rather than
 * React state so moving the mouse never re-renders the tree.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        ref.current?.style.setProperty('--spot-x', `${event.clientX}px`);
        ref.current?.style.setProperty('--spot-y', `${event.clientY}px`);
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      style={{
        background:
          'radial-gradient(520px circle at var(--spot-x, -100px) var(--spot-y, -100px), rgba(4,139,69,0.055), transparent 70%)',
      }}
    />
  );
}

/**
 * Ambient background: two slow green blooms plus a masked dot grid.
 * Fixed and behind everything, so it costs one composited layer and nothing else.
 */
export function AmbientBackdrop() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="dot-grid absolute inset-0 opacity-[0.55]"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 55% at 50% 0%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 55% at 50% 0%, black, transparent 75%)',
        }}
      />
      <div
        className={`absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full blur-[140px] ${
          reducedMotion ? '' : 'animate-aurora'
        }`}
        style={{ background: 'radial-gradient(circle, rgba(4,139,69,0.30), transparent 65%)' }}
      />
      <div
        className={`absolute right-[-12rem] top-[45%] h-[30rem] w-[30rem] rounded-full blur-[150px] ${
          reducedMotion ? '' : 'animate-aurora'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(22,196,106,0.14), transparent 68%)',
          animationDelay: '-9s',
        }}
      />
    </div>
  );
}
