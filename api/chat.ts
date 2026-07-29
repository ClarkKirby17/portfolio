import { OUT_OF_SCOPE_REPLY, buildSystemPrompt } from '../src/data/assistant';

/**
 * POST /api/chat: the "Ask about Clark" backend.
 *
 * Why this exists as a server function at all:
 *
 * 1. THE KEY. A key in the frontend bundle is a key in the visitor's network
 *    tab. Free-tier quota gets drained by the first person who looks.
 * 2. THE GUARDRAIL. The scope rule ("only answer about Clark") is only a rule
 *    if the user cannot edit it before it is sent. Client-side filtering is
 *    theatre: anyone can open devtools and change the payload.
 *
 * Runs on Vercel's Edge runtime. For Netlify, Cloudflare Workers, or Deno
 * Deploy the body is unchanged. Only the export signature differs.
 */

export const config = { runtime: 'edge' };

// Available on Vercel Edge without pulling in @types/node.
declare const process: { env: Record<string, string | undefined> };

type Provider = 'gemini' | 'groq';

const PROVIDER = (process.env.AI_PROVIDER ?? 'gemini') as Provider;

/**
 * Model IDs move. Gemini retired the 2.0 family in June 2026 and moved the
 * Pro tier to paid-only in April 2026, so keep this in an env var and check
 * the current free-tier model list at ai.google.dev before deploying.
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES = 16;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Best-effort abuse brake, keyed by IP.
 *
 * Honest limitation: edge isolates do not share memory, so this throttles a
 * single hot instance rather than the whole deployment. It is enough to stop
 * a bored visitor holding down Enter. For anything stronger, put Upstash
 * Redis or Vercel KV behind it. See the README.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived isolate.
  if (hits.size > 500) hits.clear();

  return recent.length > MAX_PER_WINDOW;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/** Reject anything that is not a well-formed, plausibly human conversation. */
function parseMessages(payload: unknown): IncomingMessage[] | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const { messages } = payload as { messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return null;
  if (messages.length > MAX_MESSAGES) return null;

  const parsed: IncomingMessage[] = [];

  for (const entry of messages) {
    if (typeof entry !== 'object' || entry === null) return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string') return null;

    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return null;

    parsed.push({ role, content: trimmed });
  }

  // The conversation must end on a question, or there is nothing to answer.
  return parsed.at(-1)?.role === 'user' ? parsed : null;
}

/** Google AI Studio / Gemini Developer API. */
async function callGemini(messages: IncomingMessage[], system: string): Promise<Response> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return json(
      { error: 'No GEMINI_API_KEY found. Add it to .env.local and restart the dev server.' },
      503,
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        // The scope rule lives here, outside the conversation, where a user
        // message cannot sit next to it and argue with it.
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: 0.3, // Low: this is recall, not creative writing.
          maxOutputTokens: 400,
        },
      }),
    },
  );

  if (!response.ok) return await upstreamError(response);

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

  return json({ reply: reply || OUT_OF_SCOPE_REPLY });
}

/** Groq: OpenAI-compatible, much faster, open-weights models. */
async function callGroq(messages: IncomingMessage[], system: string): Promise<Response> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return json(
      { error: 'No GROQ_API_KEY found. Add it to .env.local and restart the dev server.' },
      503,
    );
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 400,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });

  if (!response.ok) return await upstreamError(response);

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const reply = data.choices?.[0]?.message?.content?.trim();
  return json({ reply: reply || OUT_OF_SCOPE_REPLY });
}

/**
 * Turn a provider failure into something debuggable.
 *
 * The full upstream body goes to the server log, never to the visitor. But a
 * misconfigured key or a retired model ID produces a 400/403/404, and telling
 * the developer "check your key and model" beats a generic outage message
 * that sends them hunting through the frontend.
 */
async function upstreamError(response: Response): Promise<Response> {
  const detail = await response.text().catch(() => '');
  console.error(`[api/chat] provider returned ${response.status}: ${detail.slice(0, 600)}`);

  if (response.status === 429) {
    return json({ error: 'Rate limited by the model provider. Try again in a minute.' }, 429);
  }

  if ([400, 401, 403, 404].includes(response.status)) {
    return json(
      {
        error:
          'The assistant is misconfigured: the provider rejected the request. Check the API key and model name in your environment variables. The server log has the exact reason.',
      },
      502,
    );
  }

  return json({ error: 'The assistant is unavailable.' }, 502);
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Use POST.' }, 405);
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return json({ error: 'Too many questions too quickly.' }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Malformed request body.' }, 400);
  }

  const messages = parseMessages(payload);
  if (!messages) {
    return json({ error: 'Invalid conversation payload.' }, 400);
  }

  // Rebuilt per request so a content edit is live on the next deploy without
  // a second copy of the knowledge base drifting out of sync.
  const system = buildSystemPrompt();

  try {
    return PROVIDER === 'groq'
      ? await callGroq(messages, system)
      : await callGemini(messages, system);
  } catch (error) {
    console.error('[api/chat] request failed', error);
    return json({ error: 'The assistant could not reach the model provider.' }, 502);
  }
}
