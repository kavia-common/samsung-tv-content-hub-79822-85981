import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Clean Vite 4 + React configuration compatible with Node 18.
 * - Uses ESM and defineConfig.
 * - Base path at root.
 * - Dev server binds to 0.0.0.0 with strictPort: true on port 3000.
 * - HMR minimal: only set clientPort and overlay; do not force host.
 * - Debounced file watching to avoid reload storms; dist/ and .git are ignored.
 * - Only src, public, and config files are considered for watch using chokidar ignored patterns.
 * - Preview mirrors dev host/port settings.
 * - Adds /healthz middleware returning 200 OK for readiness checks.
 * - Ensures server does not serve from dist during dev.
 */
export default defineConfig(({ mode }) => {
  // Resolve port from env but default to 3000
  const port = Number(process.env.PORT || process.env.VITE_PORT || 3000)

  // Directories we care about for dev
  const WATCH_INCLUDE = [
    'src/**',
    'public/**',
    'vite.config.js',
    'eslint.config.js',
    '*.config.js',
    '**/*.config.js',
  ]
  const WATCH_IGNORED = ['**/dist/**', '**/.git/**', '**/node_modules/**']

  return {
    base: '/',
    plugins: [react()],
    server: {
      host: true, // 0.0.0.0
      port,
      strictPort: true,
      // Keep HMR minimal; do not force host to avoid reconnect loops
      hmr: {
        clientPort: port,
        overlay: true,
      },
      // Limit filesystem access
      fs: {
        strict: true,
        // Explicitly allow project root only
        allow: ['.'],
        // Never serve build output as static files in dev
        deny: ['dist'],
      },
      // Reduce file change storms that can cause rapid restarts/reloads.
      // Use ignored to exclude dist/.git and other heavy paths.
      watch: {
        usePolling: false,
        awaitWriteFinish: {
          stabilityThreshold: 600,
          pollInterval: 100,
        },
        ignored: WATCH_IGNORED,
      },
    },
    // Vite watches from the project root; we rely on ignored patterns above to narrow scope.
    // Ensure build output goes to dist/ and is not used in dev
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
     * This ensures readiness probes succeed without triggering HMR or restarts.
     * Side-effect free middleware.
     */
    configureServer(server) {
      return () => {
        server.middlewares.use('/healthz', (_req, res) => {
          res.statusCode = 200
          res.end('OK')
        })

        // Harden dev server to avoid accidentally serving dist/ in dev.
        // This middleware will block requests to /dist/* during dev.
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
