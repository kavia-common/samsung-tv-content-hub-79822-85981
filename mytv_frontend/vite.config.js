import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Clean Vite 4 + React configuration compatible with Node 18.
 * - Uses ESM and defineConfig.
 * - Base path at root.
 * - Dev server binds to 0.0.0.0 with strictPort: true on port 3000.
 * - HMR minimal: overlay enabled; do not force host; clientPort inferred by Vite.
 * - Debounced file watching to avoid reload storms; dist/ and .git are ignored.
 * - fs.strict enabled; only allow src, public, index.html, and vite.config.js during dev; deny dist/.
 * - Preview mirrors dev host/port settings.
 * - Adds /healthz middleware returning 200 OK for readiness checks.
 * - Ensures server does not serve from dist during dev.
 * - Does not modify or watch .env aggressively (no plugins that write to files).
 */
export default defineConfig(() => {
  // Centralize port: default 3000, override via PORT or VITE_PORT
  const port = Number(process.env.PORT || process.env.VITE_PORT || 3000)

  // Watch ignore patterns
  const WATCH_IGNORED = ['**/dist/**', '**/.git/**', '**/node_modules/**']

  return {
    base: '/',
    plugins: [react()],
    server: {
      host: true,
      port,
      strictPort: true,
      hmr: {
        overlay: true,
      },
      // Limit filesystem access - do not serve dist in dev
      fs: {
        strict: true,
        allow: ['src', 'public', 'index.html', 'vite.config.js'],
        deny: ['dist'],
      },
      // Reduce file change storms that can cause rapid restarts/reloads
      watch: {
        usePolling: false,
        awaitWriteFinish: {
          stabilityThreshold: 600,
          pollInterval: 100,
        },
        ignored: WATCH_IGNORED,
      },
      middlewareMode: false,
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    preview: {
      host: true,
      port,
      strictPort: true,
    },
    // PUBLIC_INTERFACE
    /**
     * Adds a /healthz route to return 200 OK.
     * Side-effect free middleware to signal readiness.
     * Also blocks /dist/* paths in dev to ensure dev server does not serve build output.
     */
    configureServer(server) {
      return () => {
        server.middlewares.use('/healthz', (_req, res) => {
          res.statusCode = 200
          res.end('OK')
        })

        // Block accidental access to /dist/* during dev
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/dist/')) {
            res.statusCode = 404
            res.end('Not Found')
            return
          }
          next()
        })
      }
    },
  }
})
