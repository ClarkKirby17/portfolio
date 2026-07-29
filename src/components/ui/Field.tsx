import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

const controlStyles = [
  'w-full rounded-2xl border border-fog-50/10 bg-ink-850/60 px-4 py-3',
  'text-[0.9375rem] text-fog-50 placeholder:text-fog-500',
  'transition-colors duration-200',
  'hover:border-fog-50/20',
  'focus:border-accent/60 focus:bg-ink-800/70 focus:outline-none',
  'aria-[invalid=true]:border-red-500/60',
].join(' ');

interface FieldProps {
  label: string;
  error?: string;
  /** Rendered under the control; describes format, not decoration. */
  hint?: string;
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldProps
>(({ label, error, hint, className, id, ...props }, ref) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const messageId = `${fieldId}-message`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="eyebrow text-fog-300">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(controlStyles, className)}
        {...props}
      />
      {(error || hint) && (
        <p id={messageId} className={cn('text-xs', error ? 'text-red-400' : 'text-fog-500')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ label, error, hint, className, id, ...props }, ref) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const messageId = `${fieldId}-message`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="eyebrow text-fog-300">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(controlStyles, 'min-h-36 resize-y', className)}
        {...props}
      />
      {(error || hint) && (
        <p id={messageId} className={cn('text-xs', error ? 'text-red-400' : 'text-fog-500')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});
Textarea.displayName = 'Textarea';
