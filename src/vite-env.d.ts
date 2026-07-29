/// <reference types="vite/client" />

/**
 * Typed environment variables.
 *
 * Only VITE_-prefixed values reach the browser bundle. Anything secret,
 * above all the AI provider key, must NOT be prefixed, so it stays on the
 * server and never ships to a visitor's network tab.
 */
interface ImportMetaEnv {
  /** Where the assistant sends messages. Defaults to /api/chat. */
  readonly VITE_CHAT_ENDPOINT?: string;
  /** Form service URL (Formspree, Web3Forms…). Falls back to mailto if unset. */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
