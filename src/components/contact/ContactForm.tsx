import { useState, type FormEvent } from 'react';
import { Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { profile } from '@/data/profile';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Deliberately permissive: the goal is catching typos, not policing addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Posts to whatever form service is configured in VITE_CONTACT_ENDPOINT
 * (Formspree, Web3Forms, or a Vercel function: anything that accepts JSON).
 * With no endpoint configured it opens a prefilled email instead, so the
 * form is never a dead end on a fresh clone.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const update = (field: keyof typeof values) => (event: { target: { value: string } }) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Tell me who you are.';
    if (!values.email.trim()) next.email = 'I need an address to reply to.';
    else if (!EMAIL_PATTERN.test(values.email)) next.email = 'That address looks incomplete.';
    if (values.message.trim().length < 10) next.message = 'A sentence or two is enough.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${values.name}`);
      const body = encodeURIComponent(`${values.message}\n\nFrom ${values.name} (${values.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus('sent');
      setValues({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] border border-accent/25 bg-accent/[0.07] p-8">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/20 text-accent-bright">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-medium text-fog-50">Message sent</p>
          <p className="mt-1.5 text-sm leading-relaxed text-fog-300">
            I read everything and reply within a couple of days. If it is urgent, email{' '}
            <a href={`mailto:${profile.email}`} className="text-accent-bright underline-offset-4 hover:underline">
              {profile.email}
            </a>{' '}
            directly.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setStatus('idle')}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={update('name')}
          error={errors.name}
          placeholder="Jane Reyes"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update('email')}
          error={errors.email}
          placeholder="jane@company.com"
        />
      </div>

      <Textarea
        label="Message"
        name="message"
        value={values.message}
        onChange={update('message')}
        error={errors.message}
        placeholder="What role are you hiring for, and what would I be working on?"
      />

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-400">
          The message did not send. Email {profile.email} instead and it will reach me.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full sm:w-fit">
        {status === 'sending' ? 'Sending…' : 'Send message'}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
