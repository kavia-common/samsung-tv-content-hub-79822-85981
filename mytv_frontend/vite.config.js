import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 with orchestrator-friendly port/host handling.
 * - Host: 0.0.0.0 (host: true) unless overridden by --host/HOST
 * - Port: undefined in config so CLI/env control it; strictPort=true to avoid silent switching
 * - HMR: overlay enabled; clientPort derived from env/CLI (PORT) for reliable proxying
 * - Healthz endpoint and /dist guard middleware
 * - Robust watcher ignores config/docs/locks to avoid self-restarts
 * - Single configureServer hook; no custom keepalive to minimize memory
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
      'vscode-internal-10832-beta.beta01.cloud.kavia.ai',
      'vscode-internal-16837-beta.beta01.cloud.kavia.ai',
    ])
  )

  // Determine port from env if provided (orchestrator may pass --port; Vite will set config.port accordingly).
  // We only use this to shape HMR clientPort; leaving server.port undefined lets CLI win.
  const cliPort = process.env.PORT ? Number(process.env.PORT) : undefined
  const hmrClientPort = Number.isFinite(cliPort) ? cliPort : undefined

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
    // Extra ignores to avoid HMR loops from static HTML assets
    // Any raw HTML placed under public/assets or any assets folder should not trigger reloads.
    '**/public/assets/**/*.html',
    '**/assets/**/*.html',
    // Ignore everything outside the project to avoid accidental FS scans
    '../../**',
  ]

  const baseConfig = {
    base: '/',
    clearScreen: false,
    plugins: [react()],
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
      // Do not attempt to optimize non-modules or raw asset scripts that could be copied into public/assets
      exclude: [
        // any stray design/demo scripts that must NOT be treated as modules
        '/assets/**/*.html',
      ],
    },
  }

  // Single configureServer hook (avoid duplicates or heavy work)
  baseConfig.configureServer = (server) => {
    try {
      // Readiness endpoint for orchestrator health checks
      server.middlewares.use((req, res, next) => {
        // Ensure we match exactly /healthz (with or without query string)
        if (req?.url && req.url.split('?')[0] === '/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('OK')
          return
        }
        next()
      })

      // Disallow serving built assets during dev to prevent loops and confusion
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

  // Dev server: let CLI define port; keep strictPort
  baseConfig.server = {
    host: resolvedHost,
    port: undefined,
    strictPort: true,
    open: false,
    allowedHosts,
    hmr: {
      overlay: true,
      clientPort: hmrClientPort,
    },
    watch: {
      // polling off to reduce CPU/memory
      usePolling: false,
      // debounce fs changes
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
      // chokidar ignored patterns
      // Also ignore any reference/design HTML placed under assets-reference (just in case someone moves it)
      ignored: [
        ...ignoredGlobs,
        '**/assets-reference/**/*.html',
        // Extra belt-and-suspenders: ignore any html sitting directly under public/assets,
        // and any stray reference html under top-level assets-reference copies.
        'public/assets/**/*.html',
        'assets-reference/**/*.html',
      ],
    },
    fs: {
      // Keep strict FS serving to avoid external directory scans and accidental reloads
      strict: true,
      allow: [srcDir, publicDir, indexHtml],
      deny: ['dist'],
    },
    middlewareMode: false,
  }

  // Preview mirrors dev host and allowedHosts; leave port undefined for CLI control
  // Also keep the same ignored patterns to avoid preview watcher churn in some orchestrators.
  baseConfig.preview = {
    host: resolvedHost,
    port: undefined,
    strictPort: true,
    open: false,
    allowedHosts,
    // Some environments run preview with a file watcher; align ignore list to avoid reload storms
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
        // Ensure any stray raw HTML under static paths don't trigger loops
        '**/public/assets/**/*.html',
        'public/assets/**/*.html',
        '**/assets/**/*.html',
        '**/assets-reference/**/*.html',
        'assets-reference/**/*.html',
        '../../**',
      ],
    },
  }

  return baseConfig
})
