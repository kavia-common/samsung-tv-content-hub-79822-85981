import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Minimal, stable Vite v4 config for React.
 * - No server close interception or lifecycle guards or guards/keep-alive touching server objects.
 * - clearScreen disabled for cleaner logs.
 * - server: host true (0.0.0.0), strictPort true, fs.strict false.
 * - HMR configured for orchestrator proxy with host and clientPort.
 * - Health endpoints: /healthz and /api/healthz for readiness.
 */
export default defineConfig(() => {
  // Derive HMR values based on orchestrator
  const hmrHost = 'vscode-internal-19531-beta.beta01.cloud.kavia.ai'
  // Client connects through proxy port when provided; otherwise default to 443 for secured tunnels.
  const derivedPort = Number(process.env.PORT)
  const clientPort = Number.isFinite(derivedPort) && derivedPort > 0 ? derivedPort : 443
  const protocol = (process.env.VITE_HMR_PROTOCOL || '').toLowerCase()
  const hmrProtocol = protocol === 'ws' || protocol === 'wss' ? protocol : 'auto'

  return {
    clearScreen: false,
    plugins: [react()],
    server: {
      host: true, // resolves to 0.0.0.0
      strictPort: true,
      // port is inherited from CLI/env; do not hardcode here
      fs: {
        strict: false,
      },
      watch: {
        // Debounce file writes and ignore common churn paths to avoid loops
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
          '**/*.lock',
          '**/package-lock.json',
          '**/pnpm-lock.yaml',
          '**/yarn.lock',
          '**/vite.config.*',
          '**/*eslint*.config.*',
          '**/*.config.*',
          '**/post_process_status.lock',
          'public/assets/**/*.html',
          'assets-reference/**/*.html',
          '**/assets/**/*.html',
          '../../**',
          '../../../**',
        ],
      },
      hmr: {
        host: hmrHost,
        clientPort,
        protocol: hmrProtocol,
      },
    },
    // Health endpoints and /dist 404 guard only; no lifecycle interception.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req?.url || '').split('?')[0]
        if (url === '/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('OK')
          return
        }
        if (url === '/api/healthz') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ status: 'ok' }))
          return
        }
        if (url.startsWith('/dist/')) {
          res.statusCode = 404
          res.end('Not Found')
          return
        }
        next()
      })
    },
    preview: {
      host: true,
      strictPort: true,
    },
  }
})
