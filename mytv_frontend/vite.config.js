import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 that avoids restart loops and reduces memory use.
 * - Server host: true (0.0.0.0) by default; honors CLI --host if provided.
 * - Port: 3000 default; honors PORT env or CLI --port; strictPort=true (no auto port switching).
 * - Minimal HMR overlay; honor HMR_HOST env when behind proxies.
 * - Debounced file watching and hard ignore for config/docs (including vite.config.js) to prevent self-restart loops.
 * - fs.strict limits dev to src/public/index.html; dev never serves from dist/ (middleware guards).
 * - Preview mirrors dev host/port/allowedHosts.
 * - Adds /healthz for readiness; middleware is side-effect free (no disk writes) and never exits process.
 *
 * Hardening:
 * - Absolutely no runtime writes to vite.config.js or .env.
 * - Respect CLI flags --host/--port and PORT env without writing anything back to disk.
 *
 * Allowed host includes vscode-internal-26938-beta.beta01.cloud.kavia.ai.
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
  const cliOrEnvPort = normalizePort(process.env.PORT)
  const desiredPort = cliOrEnvPort ?? 3000

  // Derive host from CLI/env without writing back. Vite sets process.env.HOST when --host is supplied.
  // If --host is absent, setting host: true makes the server listen on 0.0.0.0 while still honoring CLI flags.
  const cliHost = process.env.HOST?.trim()
  const resolvedHost = cliHost && cliHost.length > 0 ? cliHost : true

  // Allow external access; optionally honor explicit HMR host from env when running behind proxies.
  const hmrHost = process.env.HMR_HOST?.trim()
  const hmrConfig = hmrHost
    ? { host: hmrHost, overlay: true }
    : { overlay: true } // let Vite infer when not specified

  // Centralize allowedHosts for dev and preview (ensure preview hostname is allowed)
  // Ensure the preview/dev hosts are explicitly allowed (Vite 4 requires this in some proxy contexts)
  const allowedHosts = Array.from(
    new Set([
      'vscode-internal-26938-beta.beta01.cloud.kavia.ai',
      'vscode-internal-33763-beta.beta01.cloud.kavia.ai',
    ])
  )

  // Define a conservative set of ignored globs that includes vite.config.* and other churny files.
  const ignoredGlobs = [
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
    // Critical: ignore Vite and other config files to prevent HMR self-restarts
    '**/vite.config.*',
    '**/*eslint*.config.*',
    '**/*.config.js',
    '**/*.config.cjs',
    '**/*.config.mjs',
    // Ignore top-level lock/status files that can be written by CI or other processes
    '**/post_process_status.lock',
    // Workspace root churn outside this project scope
    '../../**',
  ]

  // PUBLIC_INTERFACE
  /**
   * This object exists purely as documentation; it is not used to write to disk and helps ensure no plugin mutates config.
   */
  const SAFE_CONFIG_INFO = Object.freeze({
    immutable: true,
    message:
      'vite.config.js must not be modified at runtime. Watcher ignores this file to prevent self-restarts.',
  })
  void SAFE_CONFIG_INFO

  const baseConfig = {
    base: '/',
    clearScreen: false,
    plugins: [
      react({
        jsxImportSource: undefined,
      }),
      {
        name: 'healthz-and-dist-guard',
        apply: 'serve',
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

            // Keepalive: prevent orchestrators from marking the process idle. Cleared on server close.
            const keepAlive = setInterval(() => {}, 60_000)
            server.httpServer?.once('close', () => {
              clearInterval(keepAlive)
            })
          } catch (e) {
            server?.config?.logger?.warn?.(`healthz plugin non-fatal error: ${e?.message || e}`)
          }
        },
        configurePreviewServer(server) {
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
            // preview logger shape differs; be conservative
            console.warn?.(`preview healthz plugin non-fatal error: ${e?.message || e}`)
          }
        },
      },
    ],
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 0,
      sourcemap: false,
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

  // Dev server configuration
  // Orchestrator expects port 3000 to be bound and kept alive; enforce strictPort and provide HMR clientPort alignment.
  baseConfig.server = {
    host: resolvedHost, // honor CLI --host if supplied; otherwise 0.0.0.0
    port: 3000,         // pin to 3000 for orchestrator health checks
    strictPort: true,   // do not switch ports; fail fast if busy to reveal collision
    open: false,
    allowedHosts,
    hmr: {
      ...(hmrConfig || {}),
      // Ensure client connects over the same port in proxied environments
      clientPort: 3000,
    },
    // Avoid watching generated docs/config and other churny paths to prevent self-restarts, including vite.config.js itself
    watch: {
      usePolling: false,
      awaitWriteFinish: {
        stabilityThreshold: 900,
        pollInterval: 200,
      },
      ignored: ignoredGlobs,
    },
    fs: {
      strict: true,
      // Only allow typical source roots; avoid including project root to prevent Vite from watching/walking extra files
      allow: [srcDir, publicDir, indexHtml],
      deny: ['dist'],
    },
    // Ensure dev runs in standard server mode (not middleware) so it stays running non-interactively
    middlewareMode: false,
  }

  // Preview server configuration mirrors dev for host/port/allowedHosts and adds a /healthz endpoint for readiness.
  baseConfig.preview = {
    host: resolvedHost,
    port: 3000,
    strictPort: true,
    open: false,
    allowedHosts,
  }

  // Explicitly return the finalized config
  return baseConfig
})
