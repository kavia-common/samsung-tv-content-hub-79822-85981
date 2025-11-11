import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Minimal, stable Vite v4 config for React.
 * - No server lifecycle interception or keepalive timers/logs.
 * - clearScreen disabled for clean logs in CI.
 * - server: host true (0.0.0.0), strictPort true, fs.strict false.
 * - watch ignores common churn paths; safe globs only.
 * - HMR configured to use the proxy-exposed host with clientPort derived from PORT/CLI.
 * - Health endpoints: /healthz (text) and /api/healthz (json).
 */
export default defineConfig(() => {
  // Derive HMR client configuration suitable for a reverse proxy
  const derivedPort = Number(process.env.PORT)
  const clientPort = Number.isFinite(derivedPort) && derivedPort > 0 ? derivedPort : 3000
  const hmrHost =
    process.env.VITE_HMR_HOST ||
    'vscode-internal-19531-beta.beta01.cloud.kavia.ai'
  const hmrProtocol = (() => {
    const p = (process.env.VITE_HMR_PROTOCOL || '').toLowerCase()
    return p === 'ws' || p === 'wss' ? p : 'auto'
  })()

  return {
    clearScreen: false,
    plugins: [react()],
    server: {
      host: true, // resolves to 0.0.0.0
      strictPort: true,
      // Do not hardcode port; allow CLI/env to control it.
      fs: {
        strict: false,
      },
      watch: {
        // Avoid heavy/unsafe patterns; keep ignores minimal and safe.
        ignored: [
          '**/dist/**',
          '**/.git/**',
          '**/node_modules/**',
          '**/*.md',
          '**/README.md',
          '**/DEV_SERVER.md',
          '**/.env*',
          '**/*.lock',
          '**/package-lock.json',
          '**/pnpm-lock.yaml',
          '**/yarn.lock',
          '**/post_process_status.lock',
          'assets-reference/**/*.html',
          'public/assets/**/*.html',
        ],
      },
      hmr: {
        host: hmrHost,
        clientPort,
        protocol: hmrProtocol,
      },
    },
    // Preserve minimal middlewares for health checks; no additional guards
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
        next()
      })
    },
    preview: {
      host: true,
      strictPort: true,
    },
  }
})
