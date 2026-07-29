import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE_SMOOTH } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  /** Seconds. Used to stagger siblings without a parent variant. */
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Scroll-triggered fade-and-rise. `once: true` matters: replaying an
 * entrance every time an element re-enters the viewport is the single
 * fastest way to make a site feel cheap.
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: EASE_SMOOTH }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
