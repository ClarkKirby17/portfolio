import { useCallback, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';
import { uid } from '@/lib/utils';

const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT ?? '/api/chat';

/** Keep the payload small. The system prompt is large enough already. */
const MAX_HISTORY_TURNS = 8;

interface ChatState {
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
}

/**
 * Conversation state for the assistant.
 *
 * The system prompt and the knowledge base live on the server, never here.
 * Shipping them to the browser would hand anyone the API key's job for free
 * and let them edit the rules before the request is sent.
 */
export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isSending: false,
    error: null,
  });

  // Lets a user close the panel mid-request without leaving a fetch running.
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || state.isSending) return;

      const userMessage: ChatMessage = { id: uid('u'), role: 'user', content };
      const history = [...state.messages, userMessage];

      setState({ messages: history, isSending: true, error: null });

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history.slice(-MAX_HISTORY_TURNS * 2).map(({ role, content: c }) => ({
              role,
              content: c,
            })),
          }),
        });

        if (!response.ok) {
          // The endpoint returns a specific reason (missing key, bad model,
          // rate limit). Show it rather than flattening every failure into
          // one message that gives nobody anything to act on.
          let detail = '';
          try {
            const body = (await response.json()) as { error?: string };
            detail = body.error ?? '';
          } catch {
            // Non-JSON response, most often the SPA fallback HTML, which means
            // the API route is not mounted at all.
          }

          if (response.status === 404) {
            throw new Error(
              'No /api/chat endpoint responded. If this is local development, restart the dev server.',
            );
          }

          throw new Error(
            detail ||
              (response.status === 429
                ? 'That was a lot of questions at once. Give it a minute and try again.'
                : 'The assistant is unavailable right now.'),
          );
        }

        const data: { reply?: string } = await response.json();
        if (!data.reply) throw new Error('The assistant returned an empty response.');

        setState((previous) => ({
          messages: [...previous.messages, { id: uid('a'), role: 'assistant', content: data.reply! }],
          isSending: false,
          error: null,
        }));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState((previous) => ({
          ...previous,
          isSending: false,
          error:
            error instanceof Error
              ? error.message
              : 'Something went wrong reaching the assistant.',
        }));
      }
    },
    [state.isSending, state.messages],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ messages: [], isSending: false, error: null });
  }, []);

  return { ...state, send, reset };
}
