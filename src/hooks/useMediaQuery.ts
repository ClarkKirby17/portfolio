import { useEffect, useState } from 'react';

/**
 * Subscribe to a media query. Used for both breakpoints and the
 * reduced-motion preference, so decorative effects can opt out entirely
 * rather than just running faster.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/** Pointer check: the cursor spotlight is meaningless on touch. */
export const useHasFinePointer = () => useMediaQuery('(pointer: fine)');
