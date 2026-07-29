import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Every section on the site uses this wrapper, which is the only place
 * vertical rhythm and max-width are defined. Sections never set their own
 * padding: that is how gaps drift by 4px across a codebase.
 */
export function Section({
  id,
  children,
  className,
  width = 'default',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  width?: 'default' | 'wide' | 'narrow';
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative mx-auto w-full px-5 py-20 sm:px-8 md:py-28 lg:py-32',
        width === 'default' && 'max-w-6xl',
        width === 'wide' && 'max-w-7xl',
        width === 'narrow' && 'max-w-3xl',
        className,
      )}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  /** Mono eyebrow: the site's structural label voice. */
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'mb-12 flex flex-col gap-4 md:mb-16',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-accent/60" aria-hidden />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-fog-50 sm:text-5xl md:text-6xl">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed text-fog-300 sm:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </motion.header>
  );
}
