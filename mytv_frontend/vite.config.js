import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 with orchestrator-friendly port/host handling.
 * Adjusted to avoid intercepting server.close() so Vite can manage its own lifecycle.
 * - Host: 0.0.0.0 by default (can be overridden by --host/HOST).
 * - Port: controlled by CLI/env; strictPort=true prevents silent port switching.
 * - HMR: overlay enabled; clientPort derived from env/CLI (PORT) for reliable proxying.
 * - Health endpoints: /healthz (text) and /api/healthz (json) for readiness probes.
 * - Watcher ignores config/docs/locks/raw HTML to avoid self-restart loops.
 * - Dev-only keep-alive: periodic lightweight log; NO override of httpServer.close unless explicitly enabled via VITE_ENABLE_GUARD=1.
 */
export default defineConfig(() => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  const cliHost = process.env.HOST?.trim()
  const resolvedHost = cliHost && cliHost.length > 0 ? cliHost : '0.0.0.0'

  const proxyHost =
    process.env.VITE_PUBLIC_HOST?.trim() ||
    'vscode-internal-19531-beta.beta01.cloud.kavia.ai'

  const cliPort = process.env.PORT ? Number(process.env.PORT) : undefined
  const hmrClientPort = Number.isFinite(cliPort) ? cliPort : undefined

  const hmrProtocol = (() => {
    const p = (process.env.VITE_HMR_PROTOCOL || '').trim().toLowerCase()
    return p === 'ws' || p === 'wss' ? p : undefined
  })()

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
    'public/assets/**/*.html',
    'assets-reference/**/*.html',
    '**/assets/**/*.html',
    '../../**',
    '../../../**',
  ]

  // Non-invasive keep-alive plugin: only logs; does not intercept server.close by default.
  const keepAlivePlugin = {
    name: 'dev-keep-alive',
    apply: 'serve',
    configureServer(server) {
      const intervalMs = Number(process.env.VITE_KEEPALIVE_MS || 15000)
      const timer = setInterval(() => {
        try {
          server.config.logger.info?.('[keepalive] dev server alive')
        } catch { /* noop */ }
      }, Math.max(15000, intervalMs))
      server.httpServer?.once('close', () => clearInterval(timer))

      // Optional, env-gated guard: only attach when explicitly enabled
      const enableGuard = String(process.env.VITE_ENABLE_GUARD || '').trim()
      if (enableGuard === '1' || enableGuard.toLowerCase() === 'true') {
        const httpServer = server.httpServer
        if (httpServer && typeof httpServer.close === 'function') {
          const origClose = httpServer.close.bind(httpServer)
          httpServer.close = (...args) => {
            // Respect ALLOW_SERVER_CLOSE to allow controlled shutdowns
            const allowClose = process.env.ALLOW_SERVER_CLOSE === '1'
            if (!allowClose) {
              server.config.logger.warn('[guard] httpServer.close() intercepted (guard enabled). To allow, set ALLOW_SERVER_CLOSE=1')
              return
            }
            return origClose(...args)
          }
        }
      }
    },
  }

  const baseConfig = {
    base: '/',
    clearScreen: false,
    plugins: [
      react(),
      {
        name: 'dev-ready-log',
        configureServer(server) {
          server.httpServer?.once('listening', () => {
            try {
              const addr = server.httpServer.address()
              const port = typeof addr === 'object' && addr ? addr.port : process.env.PORT || '(unknown)'
              const host = resolvedHost
              server.config.logger.info(`[dev-ready] Vite listening on http://${host}:${port} (strictPort=${server.config.server?.strictPort === true})`)
              server.config.logger.info(`[dev-ready] Health checks ready: GET /healthz (text) and GET /api/healthz (json)`)
            } catch {
              // best-effort log; do not crash
            }
          })
        }
      },
      keepAlivePlugin,
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
      exclude: [],
    },
  }

  // Development middlewares
  baseConfig.configureServer = (server) => {
    try {
      // Readiness endpoints
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

      // Disallow serving built assets during dev
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

  // Dev server configuration
  baseConfig.server = {
    host: resolvedHost,
    port: undefined,
    strictPort: true,
    open: false,
    hmr: {
      overlay: true,
      clientPort: hmrClientPort,
      host: proxyHost,
      protocol: hmrProtocol,
    },
    watch: {
      usePolling: false,
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
      ignored: [
        ...ignoredGlobs,
      ],
    },
    fs: {
      strict: false,
      allow: [rootDir, srcDir, publicDir, indexHtml],
      deny: ['dist'],
    },
    middlewareMode: false,
  }

  // Preview mirrors dev behavior and exposes health endpoints
  baseConfig.preview = {
    host: resolvedHost,
    port: undefined,
    strictPort: true,
    open: false,
    hmr: {
      host: proxyHost,
      clientPort: hmrClientPort,
      protocol: hmrProtocol,
    },
    watch: {
      usePolling: false,
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
      ignored: [
        ...ignoredGlobs,
      ],
    },
  }

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
