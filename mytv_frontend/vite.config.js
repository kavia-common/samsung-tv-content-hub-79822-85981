import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 that avoids restart loops.
 * - Host/Port pinned in config: host: true, port: 3000 (overridable via env), strictPort: true.
 * - HMR minimal with overlay only.
 * - Debounced file watching and explicit ignores to prevent restarts on config or env changes.
 * - Exclude vite.config.js and .env from watch to avoid auto restarts/reloads.
 * - fs.strict limits access; dev never serves from dist/.
 * - Preview mirrors dev host/port.
 * - Adds /healthz for readiness; middleware has no file writes.
 */
export default defineConfig(() => {
  // Centralize port with default 3000
  const port = Number(process.env.PORT || process.env.VITE_PORT || 3000)

  // Watch ignore patterns, including config and env to avoid hot restarts
  const WATCH_IGNORED = [
    '**/dist/**',
    '**/.git/**',
    '**/node_modules/**',
    '**/*.md',
    // Explicitly ignore config/env files to prevent restarts caused by external churn
    '**/vite.config.js',
    '**/.env',
    '**/.env.*',
  ]

  return {
    base: '/',
    clearScreen: false, // keep logs to observe stability and avoid terminal clears
    configFile: true, // use this config file but don't trigger restarts from changes (handled via watch.ignored)
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
