import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 4 + React configuration for Node 18 with orchestrator-friendly port/host handling.
 * - Vite v4 supported fields only (e.g., server.allowedHosts as string[]).
 * - Host: 0.0.0.0 (host: true) unless overridden by --host/HOST.
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

  // Vite v4: allowedHosts is an array<string> of hostnames (no protocol/port).
  const allowedHosts = Array.from(
    new Set([
      'vscode-internal-26938-beta.beta01.cloud.kavia.ai',
      'vscode-internal-33763-beta.beta01.cloud.kavia.ai',
      'vscode-internal-10832-beta.beta01.cloud.kavia.ai',
      // Include the currently used preview domain to prevent HMR reconnect loops.
      'vscode-internal-28347-beta.beta01.cloud.kavia.ai',
      'vscode-internal-14612-beta.beta01.cloud.kavia.ai',
      // Newly added allowed host for current runner
      'vscode-internal-38453-beta.beta01.cloud.kavia.ai',
      // Requested new host
      'vscode-internal-19531-beta.beta01.cloud.kavia.ai',
    ])
  )

  // Determine port from env if provided (orchestrator may pass --port; Vite will set config.port accordingly).
  // We only use this to shape HMR clientPort; leaving server.port undefined lets CLI win.
  const cliPort = process.env.PORT ? Number(process.env.PORT) : undefined
  const hmrClientPort = Number.isFinite(cliPort) ? cliPort : undefined

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
        if (req?.url && req.url.split('?')[0] === '/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('OK')
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
    allowedHosts,
    hmr: {
      overlay: true,
      clientPort: hmrClientPort,
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
    allowedHosts,
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
        if (req?.url && req.url.split('?')[0] === '/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('OK')
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
