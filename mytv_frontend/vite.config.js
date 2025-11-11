import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 with orchestrator-friendly port/host handling.
 * Compat notes:
 * - Vite v4 does NOT support server.allowedHosts (added in v5). Remove it to avoid schema errors.
 * - Use server.hmr.host (and preview.hmr.host) so the HMR client connects via the reverse-proxied host.
 * - Host: 0.0.0.0 (host: true translates to 0.0.0.0) unless overridden by --host/HOST.
 * - Port: controlled by CLI/env; strictPort=true prevents silent port switching.
 * - HMR: overlay enabled; clientPort derived from env/CLI (PORT) for reliable proxying.
 * - Healthz endpoint and /dist guard middleware.
 * - Watcher ignores config/docs/locks/raw HTML to avoid self-restart loops.
 */
export default defineConfig(() => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  const cliHost = process.env.HOST?.trim()
  const resolvedHost = cliHost && cliHost.length > 0 ? cliHost : '0.0.0.0'

  // Host that the browser should use to reach the dev server through the orchestrator/proxy.
  // Include requested domain for stability in HMR:
  const proxyHost =
    process.env.VITE_PUBLIC_HOST?.trim() ||
    'vscode-internal-19531-beta.beta01.cloud.kavia.ai'

  // Determine port from env if provided (orchestrator may pass --port; Vite will set config.port accordingly).
  // We only use this to shape HMR clientPort; leaving server.port undefined lets CLI win.
  const cliPort = process.env.PORT ? Number(process.env.PORT) : undefined
  const hmrClientPort = Number.isFinite(cliPort) ? cliPort : undefined

  // Optional protocol override for HMR via env when running behind HTTPS proxies.
  // Accepts 'ws' or 'wss'. If not provided, Vite will infer automatically.
  const hmrProtocol = (() => {
    const p = (process.env.VITE_HMR_PROTOCOL || '').trim().toLowerCase()
    return p === 'ws' || p === 'wss' ? p : undefined
  })()

  // Keep watcher minimal to reduce memory and prevent self-restarts (Chokidar patterns only).
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
    '**/vite.config.*',
    '**/*eslint*.config.*',
    '**/*.config.js',
    '**/*.config.cjs',
    '**/*.config.mjs',
    '**/post_process_status.lock',
    // Raw/exported HTML should never reach esbuild; only ignore via chokidar watcher.
    'public/assets/**/*.html',
    'assets-reference/**/*.html',
    '**/assets/**/*.html',
  ]

  const baseConfig = {
    base: '/',
    clearScreen: false,
    plugins: [
      // Keep plugin-react without any custom esbuild options that could pass globs.
      react(),
      // Lightweight plugin to log readiness once the server is listening
      {
        name: 'dev-ready-log',
        configureServer(server) {
          server.httpServer?.once('listening', () => {
            try {
              const addr = server.httpServer.address()
              const port = typeof addr === 'object' && addr ? addr.port : process.env.PORT || '(unknown)'
              const host = resolvedHost
              server.config.logger.info(`[dev-ready] Vite listening on http://${host}:${port} (strictPort=${server.config.server?.strictPort === true})`)
              server.config.logger.info(`[dev-ready] Health checks: /healthz (text) and /api/healthz (json)`)
            } catch {
              // best-effort log; do not crash
            }
          })
        }
      }
    ],
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 0,
      sourcemap: false,
    },
    // Ensure optimizeDeps only lists package names; no paths/globs.
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: [],
    },
  }

  // Single configureServer hook (avoid duplicates or heavy work).
  baseConfig.configureServer = (server) => {
    try {
      // Readiness endpoint for orchestrator health checks.
      server.middlewares.use((req, res, next) => {
        const pathOnly = req?.url ? req.url.split('?')[0] : ''
        if (pathOnly === '/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('OK')
          return
        }
        if (pathOnly === '/api/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ status: 'ok' }))
          return
        }
        next()
      })

      // Disallow serving built assets during dev to prevent loops and confusion.
      server.middlewares.use((req, res, next) => {
        if (req?.url && req.url.startsWith('/dist/')) {
          res.statusCode = 404
          res.end('Not Found')
          return
        }
        next()
      })
    } catch (e) {
      server?.config?.logger?.warn?.(`configureServer non-fatal: ${e?.message || e}`)
    }
  }

  // Dev server: let CLI define port; keep strictPort to avoid silent switching.
  // Note: HMR clientPort is derived from env PORT when provided by orchestrator.
  // Avoid hardcoding host/port to prevent reconnect loops.
  baseConfig.server = {
    host: resolvedHost,
    port: undefined,
    strictPort: true,
    open: false,
    // allowedHosts is not supported on Vite v4; omit to avoid schema errors.
    hmr: {
      overlay: true,
      clientPort: hmrClientPort,
      host: proxyHost, // ensure HMR websocket connects via the reverse proxy host
      protocol: hmrProtocol, // allow ws/wss override via env when required by proxy
    },
    watch: {
      usePolling: false,
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
      // Multi-wildcard globs ONLY appear here for chokidar, never for esbuild.
      ignored: [
        ...ignoredGlobs,
        '**/assets-reference/**/*.html',
      ],
    },
    fs: {
      strict: true,
      allow: [srcDir, publicDir, indexHtml],
      deny: ['dist'],
    },
    middlewareMode: false,
  }

  // Preview mirrors dev configuration. Leave port undefined for CLI control.
  baseConfig.preview = {
    host: resolvedHost,
    port: undefined,
    strictPort: true,
    open: false,
    // allowedHosts not supported on Vite v4 preview either
    hmr: {
      host: proxyHost,
      clientPort: hmrClientPort,
      protocol: hmrProtocol,
    },
    watch: {
      usePolling: false,
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
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
        '**/vite.config.*',
        '**/*eslint*.config.*',
        '**/*.config.js',
        '**/*.config.cjs',
        '**/*.config.mjs',
        '**/post_process_status.lock',
        'public/assets/**/*.html',
        'assets-reference/**/*.html',
        '**/assets/**/*.html',
        // Prevent watching outside project (CI bind mounts) to avoid restarts.
        '../../**',
      ],
    },
  }

  // Provide a readiness endpoint and /dist guard for vite preview as well.
  baseConfig.configurePreviewServer = (server) => {
    try {
      server.middlewares.use((req, res, next) => {
        const pathOnly = req?.url ? req.url.split('?')[0] : ''
        if (pathOnly === '/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('OK')
          return
        }
        if (pathOnly === '/api/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ status: 'ok' }))
          return
        }
        next()
      })

      server.middlewares.use((req, res, next) => {
        if (req?.url && req.url.startsWith('/dist/')) {
          res.statusCode = 404
          res.end('Not Found')
          return
        }
        next()
      })
    } catch (e) {
      server?.config?.logger?.warn?.(`configurePreviewServer non-fatal: ${e?.message || e}`)
    }
  }

  return baseConfig
})
