import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * One button component for the whole site. Variants are named for intent
 * ("primary", "ghost") rather than appearance, so a palette change never
 * turns a component name into a lie.
 */
const buttonVariants = cva(
  [
    'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium select-none rounded-full',
    'transition-[transform,background-color,border-color,box-shadow,color] duration-300',
    'ease-[cubic-bezier(0.32,0.72,0,1)]',
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-45',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-fog-50 border border-accent-bright/30',
          'shadow-[0_0_0_0_rgba(22,196,106,0)]',
          'hover:bg-accent-dim hover:shadow-[0_8px_32px_-8px_rgba(4,139,69,0.75)]',
        ].join(' '),
        secondary: [
          'glass text-fog-50',
          'hover:bg-fog-50/[0.08] hover:border-fog-50/20',
        ].join(' '),
        ghost: 'text-fog-300 hover:text-fog-50 hover:bg-fog-50/[0.06]',
        outline: [
          'border border-accent/40 text-accent-bright bg-accent/[0.06]',
          'hover:bg-accent/[0.14] hover:border-accent-bright/60',
        ].join(' '),
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-[0.9375rem]',
        lg: 'h-13 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. an anchor or router Link) instead of a <button>. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
export { buttonVariants };
