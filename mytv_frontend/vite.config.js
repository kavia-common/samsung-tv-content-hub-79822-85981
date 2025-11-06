import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 that avoids restart loops and reduces memory use.
 * - Server host: true (0.0.0.0), port: 3000 default, strictPort: true. Honors PORT env and CLI --port.
 * - Minimal HMR (overlay only); do not force host unless provided via env.
 * - Debounced file watching; explicitly ignores config/env and non-source paths.
 * - fs.strict limits access to src/public/index.html; dev never serves from dist/.
 * - Preview mirrors dev host/port.
 * - Adds /healthz for readiness; middleware is side-effect free (no disk writes) and never exits process.
 */
export default defineConfig(() => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  // Determine port: prefer CLI --port (Vite sets process.env.PORT accordingly), then env, else 3000.
  const normalizePort = (p) => {
    const n = Number(p)
    return Number.isFinite(n) && n > 0 ? n : undefined
  }
  // Vite sets process.env.PORT when --port is provided on CLI
  const cliOrEnvPort = normalizePort(process.env.PORT)
  const desiredPort = cliOrEnvPort ?? 3000

  // Allow external access; optionally honor explicit HMR host from env when running behind proxies.
  const hmrHost = process.env.HMR_HOST?.trim()
  const hmrConfig = hmrHost
    ? { host: hmrHost, overlay: true }
    : { overlay: true } // let Vite infer when not specified

  // Centralize allowedHosts for dev and preview
  const allowedHosts = ['vscode-internal-26938-beta.beta01.cloud.kavia.ai']

  return {
    base: '/',
    clearScreen: false,
    plugins: [
      react({
        jsxImportSource: undefined,
      }),
    ],
    server: {
      host: true, // 0.0.0.0
      port: desiredPort,
      strictPort: true,
      open: false,
      // Explicitly allow the remote VS Code host (stops 400 host check errors)
      allowedHosts,
      hmr: hmrConfig,
      // Avoid watching generated docs/config and other churny paths to prevent self-restarts
      watch: {
        usePolling: false,
        awaitWriteFinish: {
          stabilityThreshold: 900,
          pollInterval: 200,
        },
        ignored: [
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
          // Ignore top-level lock/status files that can be written by CI or other processes
          '**/post_process_status.lock',
          // Workspace root churn outside this project
          '../../**',
        ],
      },
      fs: {
        strict: true,
        // Only allow typical source roots; avoid including project root to prevent Vite from watching/walking extra files
        allow: [srcDir, publicDir, indexHtml],
        deny: ['dist'],
      },
      // Ensure dev runs in standard server mode (not middleware) so it stays running non-interactively
      middlewareMode: false,
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 0,
      sourcemap: false,
    },
    preview: {
      host: true,
      port: desiredPort,
      strictPort: true,
      open: false,
      // Match dev allowedHosts for preview stability
      allowedHosts,
    },
    optimizeDeps: {
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
        server?.config?.logger?.warn?.(`configureServer non-fatal error: ${e?.message || e}`)
      }
    },
  }
})
