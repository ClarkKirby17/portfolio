import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badges are metadata, so they take the mono utility face. The same signal
 * used by eyebrows and section labels across the site.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-mono text-[0.6875rem] tracking-wide whitespace-nowrap transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'border border-fog-50/10 bg-fog-50/[0.04] text-fog-300',
        accent: 'border border-accent/30 bg-accent/10 text-accent-bright',
        muted: 'border border-transparent bg-fog-50/[0.03] text-fog-500',
      },
      size: {
        sm: 'px-2 py-0.5',
        md: 'px-2.5 py-1',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
