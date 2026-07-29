import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

interface Options {
  /** Only start once the element is on screen. */
  active: boolean;
  duration?: number;
}

/**
 * Animate a number from 0 to `target` with an ease-out curve.
 * Uses requestAnimationFrame rather than a setInterval so it stays in step
 * with the display refresh and pauses when the tab is backgrounded.
 */
export function useCountUp(target: number, { active, duration = 1400 }: Options): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;

    // No animation means no suspense. Show the real number immediately.
    if (reducedMotion) {
      setValue(target);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [active, duration, reducedMotion, target]);

  return value;
}
