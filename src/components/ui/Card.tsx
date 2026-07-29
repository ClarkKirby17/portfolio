import { useRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useHasFinePointer } from '@/hooks/useMediaQuery';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Lift and brighten the border on hover. Off for static content blocks. */
  interactive?: boolean;
  /**
   * A faint radial highlight that follows the cursor across the card.
   * Written to CSS variables via a ref so the pointer never triggers a
   * React re-render, since this runs on every mousemove.
   */
  sheen?: boolean;
  as?: 'div' | 'article' | 'li';
}

/**
 * Surface primitive.
 *
 * Important: children render as DIRECT children of the root element, with no
 * wrapper. That is what lets a caller pass layout classes like
 * "grid lg:grid-cols-2" or "flex flex-col" and have them apply to the content.
 * An earlier version wrapped children in a positioning div, which silently
 * collapsed every multi-column card into a single column.
 *
 * The sheen is therefore a background layer on the root (see .card-sheen in
 * index.css) rather than an overlay element, because an extra element would
 * either become a stray grid item or force that wrapper back.
 */
export function Card({
  children,
  className,
  interactive = false,
  sheen = false,
  as: Component = 'div',
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();
  const sheenEnabled = sheen && hasFinePointer;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!sheenEnabled || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--sheen-x', `${event.clientX - bounds.left}px`);
    ref.current.style.setProperty('--sheen-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <Component
      ref={ref as never}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-card)] border border-fog-50/[0.07] bg-ink-850/70',
        'backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        interactive &&
          'hover:-translate-y-1 hover:border-accent/25 hover:bg-ink-800/70 hover:shadow-[0_24px_60px_-32px_rgba(4,139,69,0.5)]',
        sheenEnabled && 'card-sheen',
        className,
      )}
    >
      {children}
    </Component>
  );
}
