import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 that avoids restart loops and keeps the dev server alive.
 * - Host: 0.0.0.0 (host: true) unless overridden by --host
 * - Port: 3000 strict (fail if busy to expose collisions rather than silently switching)
 * - HMR: overlay enabled; clientPort fixed to 3000 to match orchestrator proxying
 * - Healthz endpoint and /dist guard middleware
 * - Robust watcher ignores config/docs/locks to avoid self-restarts
 * - No plugin or script calls process.exit in serve/preview paths
 */
export default defineConfig(() => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  const cliHost = process.env.HOST?.trim()
  const resolvedHost = cliHost && cliHost.length > 0 ? cliHost : true

  const allowedHosts = Array.from(
    new Set([
      'vscode-internal-26938-beta.beta01.cloud.kavia.ai',
      'vscode-internal-33763-beta.beta01.cloud.kavia.ai',
    ])
  )

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
    '../../**',
  ]

  const baseConfig = {
    base: '/',
    clearScreen: false,
    plugins: [
      react(),
      {
        // Keep the server "busy" so orchestrators don't mark it idle, but never exit the process.
        name: 'healthz-keepalive-and-guards',
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
            const keepAlive = setInterval(() => {}, 60_000)
            server.httpServer?.once('close', () => clearInterval(keepAlive))
          } catch (e) {
            server?.config?.logger?.warn?.(`dev plugin non-fatal: ${e?.message || e}`)
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
            console.warn?.(`preview plugin non-fatal: ${e?.message || e}`)
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
  }

  // Single configureServer hook (avoid duplicates that can lead to lifecycle ambiguity)
  baseConfig.configureServer = (server) => {
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
      server?.config?.logger?.warn?.(`configureServer non-fatal: ${e?.message || e}`)
    }
  }

  // Dev server: pin to 3000 and keep alive; avoid middlewareMode which could allow parent to exit early
  baseConfig.server = {
    host: resolvedHost,
    port: 3000,
    strictPort: true,
    open: false,
    allowedHosts,
    hmr: {
      overlay: true,
      clientPort: 3000,
    },
    watch: {
      usePolling: false,
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
      ignored: ignoredGlobs,
    },
    fs: {
      strict: true,
      allow: [srcDir, publicDir, indexHtml],
      deny: ['dist'],
    },
    middlewareMode: false,
  }

  // Preview mirrors dev host/port and allowedHosts
  baseConfig.preview = {
    host: resolvedHost,
    port: 3000,
    strictPort: true,
    open: false,
    allowedHosts,
  }

  return baseConfig
})
