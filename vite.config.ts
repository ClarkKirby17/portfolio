import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

/**
 * Runs the serverless functions in `api/` during `npm run dev`.
 *
 * Vite only serves static files, so without this a request to /api/chat falls
 * through to the SPA fallback and the assistant reports itself unavailable
 * even when the API key is set correctly. This mounts the same handler that
 * production uses, converting between Node's req/res and the Web Request and
 * Response objects the handler expects.
 */
function devApiRoutes(env: Record<string, string>): Plugin {
  return {
    name: 'dev-api-routes',
    apply: 'serve',
    configureServer(server) {
      // Vite only exposes VITE_-prefixed vars to the client. The handler runs
      // in Node here, so give it the unprefixed secrets too.
      for (const [key, value] of Object.entries(env)) {
        if (!key.startsWith('VITE_')) process.env[key] ??= value;
      }

      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const module = await server.ssrLoadModule('/api/chat.ts');
          const handler = module.default as (request: Request) => Promise<Response>;

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value);
          }

          const response = await handler(
            new Request(`http://localhost${req.url ?? '/'}`, {
              method: req.method ?? 'GET',
              headers,
              body: chunks.length ? Buffer.concat(chunks) : undefined,
            }),
          );

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          console.error('[dev-api-routes]', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Dev API route failed. See the terminal.' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // '' loads every variable, not just the VITE_-prefixed ones.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), devApiRoutes(env)],
    resolve: {
      // "@/..." maps to "src/..." so imports never turn into ../../../ chains.
      alias: { '@': path.resolve(__dirname, './src') },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Keep the vendor bundle out of the app bundle so a content edit
          // does not invalidate the whole cache for returning visitors.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  };
});
