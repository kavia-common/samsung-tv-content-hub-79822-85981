import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 5 + React configuration with orchestrator-friendly behavior.
 * - Host: 0.0.0.0 (host: true) unless overridden by --host/HOST
 * - Port: undefined in config so CLI/env control it; strict switching disabled (strictPort: false) to avoid premature exit
 * - HMR: overlay enabled; clientPort derived from env/CLI (PORT) for reliable proxying; defaults to 3000 to match preview
 * - Healthz endpoint and /dist guard middleware
 * - Robust watcher ignores config/docs/locks to avoid self-restarts
 */
export default defineConfig(() => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  const cliHost = process.env.HOST?.trim()
  const resolvedHost = cliHost && cliHost.length > 0 ? cliHost : true

  // Include proxy hosts that may be used in CI/preview
  const allowedHosts = Array.from(
    new Set([
      'vscode-internal-26938-beta.beta01.cloud.kavia.ai',
      'vscode-internal-33763-beta.beta01.cloud.kavia.ai',
      'vscode-internal-10832-beta.beta01.cloud.kavia.ai',
      'vscode-internal-16837-beta.beta01.cloud.kavia.ai',
      // Current environment/session
      'vscode-internal-39544-beta.beta01.cloud.kavia.ai',
    ])
  )

  // Use env PORT for HMR clientPort when provided by orchestrator; default to 3000 for preview system
  const cliPort = process.env.PORT ? Number(process.env.PORT) : undefined
  const hmrClientPort = Number.isFinite(cliPort) ? cliPort : 3000

  // Chokidar watch ignores (do not pass to esbuild or rollup)
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
      exclude: [],
    },
  }

  baseConfig.configureServer = (server) => {
    try {
      // Readiness endpoint
      server.middlewares.use((req, res, next) => {
        const url = req?.url?.split('?')[0]
        if (url === '/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('OK')
          return
        }
        next()
      })
      // Block built assets in dev
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

  baseConfig.server = {
    host: resolvedHost,
    port: undefined, // CLI controls; allow fallback if busy
    strictPort: false, // do not exit on port contention; preview will still proxy to selected port
    open: false,
    allowedHosts,
    hmr: {
      overlay: true,
      clientPort: hmrClientPort,
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
  }

  baseConfig.preview = {
    host: resolvedHost,
    port: undefined,
    strictPort: false,
    open: false,
    allowedHosts,
    watch: {
      usePolling: false,
      awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
      ignored: ignoredGlobs,
    },
  }

  return baseConfig
})
