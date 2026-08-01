import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, RotateCcw, Sparkles, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { SUGGESTED_QUESTIONS } from '@/data/assistant';
import { profile } from '@/data/profile';
import { EASE_SMOOTH, cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * "Ask about Clark": a scoped assistant.
 *
 * Design intent: this is the one place on the site that gets a glow. It is
 * the signature interaction, so everything around it stays quiet.
 *
 * Scope is enforced on the server (see `api/chat.ts` and `data/assistant.ts`),
 * not here. Client-side filtering would be trivial to bypass; the guardrail
 * lives with the API key.
 */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const { messages, isSending, error, send, reset } = useChat();
  const [draft, setDraft] = useState('');
  const reducedMotion = usePrefersReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Escape closes the panel and returns focus to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Follow the conversation as it grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [messages, isSending, reducedMotion]);

  const submit = (text: string) => {
    if (!text.trim() || isSending) return;
    void send(text);
    setDraft('');
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="ask-about-clark"
        aria-label={open ? 'Close the assistant' : 'Ask a question about Clark'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5, ease: EASE_SMOOTH }}
        className={cn(
          'fixed bottom-6 right-5 z-50 grid h-14 w-14 place-items-center rounded-full sm:right-8',
          'border border-accent-bright/30 bg-accent text-fog-50',
          'shadow-[0_10px_40px_-10px_rgba(4,139,69,0.85)]',
          'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          'hover:scale-105 active:scale-95',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="ask-about-clark"
            role="dialog"
            aria-label="Ask about Clark"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.32, ease: EASE_SMOOTH }}
            className={cn(
              'glass-strong fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-3xl sm:right-8',
              'h-[min(34rem,calc(100dvh-9rem))] w-[calc(100vw-2rem)] sm:w-[24rem]',
              'shadow-[0_32px_90px_-40px_rgba(0,0,0,0.9)]',
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-fog-50/[0.07] px-5 py-4">
              <div>
                <p className="font-medium leading-tight text-fog-50">Ask about Clark</p>
                <p className="mt-0.5 text-xs leading-snug text-fog-500">
                  Answers come from this site only
                </p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Start a new conversation"
                    className="grid h-8 w-8 place-items-center rounded-lg text-fog-500 transition-colors hover:bg-fog-50/[0.06] hover:text-fog-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    launcherRef.current?.focus();
                  }}
                  aria-label="Close the assistant"
                  className="grid h-8 w-8 place-items-center rounded-lg text-fog-500 transition-colors hover:bg-fog-50/[0.06] hover:text-fog-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-5 py-4"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.length === 0 && (
                <div className="flex flex-col gap-4 pt-2">
                  <p className="text-sm leading-relaxed text-fog-300">
                    I know {profile.firstName}&apos;s projects, stack, and experience. Ask me
                    anything about his work. I can&apos;t help with anything else.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => submit(question)}
                        className="rounded-xl border border-fog-50/[0.08] bg-fog-50/[0.02] px-3.5 py-2.5 text-left text-[0.8125rem] text-fog-300 transition-all duration-200 hover:border-accent/30 hover:bg-accent/[0.07] hover:text-fog-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[0.8125rem] leading-relaxed',
                    message.role === 'user'
                      ? 'ml-auto bg-accent/15 text-fog-50 ring-1 ring-accent/25'
                      : 'mr-auto bg-fog-50/[0.05] text-fog-300',
                  )}
                >
                  {message.content}
                </div>
              ))}

              {isSending && (
                <div className="mr-auto flex items-center gap-1.5 rounded-2xl bg-fog-50/[0.05] px-4 py-3.5">
                  <span className="sr-only">Thinking</span>
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      aria-hidden
                      className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-accent-bright"
                      style={{ animationDelay: `${index * 0.14}s` }}
                    />
                  ))}
                </div>
              )}

              {error && (
                <p className="mr-auto rounded-2xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-[0.8125rem] text-red-300">
                  {error} You can reach {profile.firstName} directly at {profile.email}.
                </p>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-fog-50/[0.07] p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-fog-50/[0.08] bg-ink-850/70 p-2 transition-colors focus-within:border-accent/50">
                <label htmlFor="assistant-input" className="sr-only">
                  Your question about Clark
                </label>
                <textarea
                  ref={inputRef}
                  id="assistant-input"
                  rows={1}
                  value={draft}
                  maxLength={500}
                  placeholder="Ask about a project, a stack, availability…"
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    // Enter sends, Shift+Enter breaks the line.
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      submit(draft);
                    }
                  }}
                  className="max-h-28 flex-1 resize-none bg-transparent px-2 py-1.5 text-[0.8125rem] text-fog-50 placeholder:text-fog-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => submit(draft)}
                  disabled={!draft.trim() || isSending}
                  aria-label="Send question"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-fog-50 transition-all duration-200 hover:bg-accent-dim disabled:opacity-35"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
              <p className="px-1 pt-2 text-[0.6875rem] leading-snug text-fog-500">
                AI-generated. Verify anything that matters against the resume.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
