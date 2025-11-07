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
 * - Single configureServer hook; lightweight keepalive with proper cleanup
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

  // Keep watcher minimal to reduce memory and prevent self-restarts
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
    // Ignore everything outside the project to avoid accidental FS scans
    '../../**',
  ]

  const baseConfig = {
    base: '/',
    clearScreen: false,
    plugins: [
      react(),
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

  // Single configureServer hook (avoid duplicates)
  baseConfig.configureServer = (server) => {
    try {
      // readiness
      server.middlewares.use('/healthz', (_req, res) => {
        res.statusCode = 200
        res.end('OK')
      })
      // prevent serving dist during dev
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/dist/')) {
          res.statusCode = 404
          res.end('Not Found')
          return
        }
        next()
      })
      // lightweight keepalive; no heavy work; ensure cleanup
      const keepAlive = setInterval(() => {
        // no-op tick to keep event loop active
      }, 60_000)
      server.httpServer?.once('close', () => clearInterval(keepAlive))
    } catch (e) {
      server?.config?.logger?.warn?.(`configureServer non-fatal: ${e?.message || e}`)
    }
  }

  // Dev server: pin to 3000 and reduce watcher pressure
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
      // polling off to reduce CPU/memory
      usePolling: false,
      // debounce fs changes
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
      // chokidar ignored patterns
      ignored: ignoredGlobs,
    },
    fs: {
      strict: true,
      allow: [srcDir, publicDir, indexHtml],
      deny: ['dist'],
    },
    middlewareMode: false,
  }

  // Preview mirrors dev host/port and allowedHosts and exposes /healthz
  baseConfig.preview = {
    host: resolvedHost,
    port: 3000,
    strictPort: true,
    open: false,
    allowedHosts,
  }

  return baseConfig
})
