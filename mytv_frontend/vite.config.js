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
export default defineConfig(() => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  // Read port from env or CLI --port. Keep one source of truth (strictPort true)
  const desiredPort = Number(process.env.PORT) || 3000

  return {
    base: '/',
    clearScreen: false,
    // Defer heavy plugins if needed; keep react plugin first and lean
    plugins: [
      react({
        // Keep fast-refresh defaults; avoid extra Babel plugins that can increase CPU
        jsxImportSource: undefined,
      }),
    ],
    server: {
      host: true,
      port: desiredPort,
      strictPort: true,
      open: false,
      // Allow preview access from the remote VS Code host
      allowedHosts: ['vscode-internal-26938-beta.beta01.cloud.kavia.ai'],
      hmr: {
        // Do not force host; let Vite infer correctly behind proxies
        overlay: true,
      },
      watch: {
        // Prefer native fs events when available
        usePolling: false,
        // Debounce writes to avoid rapid HMR loops
        awaitWriteFinish: {
          stabilityThreshold: 900,
          pollInterval: 200,
        },
        // Explicitly ignore non-source churn and build artifacts
        ignored: [
          // repo/build/lock files
          '**/dist/**',
          '**/.git/**',
          '**/*.md',
          '**/README.md',
          '**/DEV_SERVER.md',
          '**/CHANGELOG*',
          '**/docs/**',
          '**/node_modules/**',
          '**/.env*',
          '**/app.wgt',
          '**/scripts/**',
          '**/*.lock',
          '**/package-lock.json',
          '**/pnpm-lock.yaml',
          '**/yarn.lock',
          // workspace root churn outside this project
          '../../**',
        ],
      },
      // Limit filesystem access - do not serve dist in dev
      fs: {
        strict: true,
        allow: [srcDir, publicDir, indexHtml],
        deny: ['dist'],
      },
      // Ensure Vite doesn't attempt to run in middleware mode in CI non-interactive shell
      middlewareMode: false,
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // prevent too aggressive chunk size warnings or inlining
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 0,
      // Keep sourcemaps off by default for smaller output in CI
      sourcemap: false,
    },
    preview: {
      host: true,
      port: desiredPort,
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
     * Avoids throwing to prevent non-interactive exits.
     */
    configureServer(server) {
      return () => {
        try {
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
        } catch (e) {
          // In non-interactive environments, never exit the process due to middleware errors.
          // Log to server for diagnostics but keep server running.
          server?.config?.logger?.warn?.(`configureServer non-fatal error: ${e?.message || e}`)
        }
      }
    },
  }
})
