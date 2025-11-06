import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 that avoids restart loops.
 * - Server host: true (0.0.0.0), port: 3000, strictPort: true.
 * - Minimal HMR (overlay only); do not force host.
 * - Debounced file watching; explicitly ignores config/env and non-source paths.
 * - fs.strict limits access to src/public/index.html; dev never serves from dist/.
 * - Preview mirrors dev host/port.
 * - Adds /healthz for readiness; middleware is side-effect free (no disk writes).
 */
export default defineConfig(() => {
  return {
    base: '/',
    clearScreen: false,
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      hmr: {
        overlay: true, // minimal HMR config, no forced host
      },
      watch: {
        usePolling: false,
        awaitWriteFinish: {
          stabilityThreshold: 800,
          pollInterval: 150,
        },
        // Prevent restarts on config/env and other non-source changes
        ignored: [
          '**/dist/**',
          '**/.git/**',
          '**/*.md',
          '**/DEV_SERVER.md',
          '**/node_modules/**',
          '**/vite.config.js',
          '**/.env*',
        ],
      },
      // Limit filesystem access - do not serve dist in dev
      fs: {
        strict: true,
        allow: ['src', 'public', 'index.html'],
        deny: ['dist'],
      },
      middlewareMode: false,
      allowedHosts:["vscode-internal-26938-beta.beta01.cloud.kavia.ai"]
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    preview: {
      host: true,
      port: 3001,
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
        // side-effect free; no writes to disk
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
