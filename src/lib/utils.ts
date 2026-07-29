import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and let later Tailwind utilities win.
 * Without twMerge, `cn('p-4', 'p-2')` would ship both and depend on CSS order.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Stable-enough ids for list keys and chat messages. */
export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Framer Motion variants reused across sections so entrances stay consistent. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Matches the `--ease-smooth` token so CSS and JS animation agree. */
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;
