import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 that avoids restart loops and reduces memory use.
 * - Server host: true (0.0.0.0), port: 3000, strictPort: true.
 * - Minimal HMR (overlay only); do not force host.
 * - Debounced file watching; explicitly ignores config/env and non-source paths.
 * - fs.strict limits access to src/public/index.html; dev never serves from dist/.
 * - Preview mirrors dev host/port.
 * - Adds /healthz for readiness; middleware is side-effect free (no disk writes).
 */
export default defineConfig(({ mode }) => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  return {
    base: '/',
    clearScreen: false,
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      open: false,
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: false,
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 200,
        },
        ignored: [
          '**/dist/**',
          '**/.git/**',
          '**/*.md',
          '**/DEV_SERVER.md',
          '**/node_modules/**',
          '**/vite.config.js',
          '**/.env*',
          '**/app.wgt',
          '**/scripts/**',
          '**/*.lock',
        ],
      },
      // Limit filesystem access - do not serve dist in dev
      fs: {
        strict: true,
        allow: [srcDir, publicDir, indexHtml],
        deny: ['dist'],
      },
      middlewareMode: false,
      // allowedHosts removed to avoid mismatch with preview domain; default is sufficient
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // prevent too aggressive chunk size warnings or inlining
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 0,
    },
    preview: {
      host: true,
      port: 3001,
      strictPort: true,
      open: false,
    },
    optimizeDeps: {
      // Keep default; no heavy prebundling needed beyond React
      include: ['react', 'react-dom', 'react-router-dom'],
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
