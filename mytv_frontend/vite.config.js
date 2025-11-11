import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Minimal Vite v4 config for React.
 * - Standard fields only; no lifecycle guards, keepalive timers, or server.close interceptions.
 * - Dev server: host 0.0.0.0 (host: true), strictPort: true, clearScreen: false, fs.strict: false.
 * - Watch ignores safe, non-source churn paths.
 * - HMR set for proxy usage; default to the given proxy host with clientPort 443 when HTTPS proxying is used.
 * - Health endpoints: GET /healthz (text) and GET /api/healthz (json).
 */
export default defineConfig(() => {
  // HMR options suitable for reverse proxy (e.g., Codespaces-style)
  const hmrHost = process.env.VITE_HMR_HOST || 'vscode-internal-19531-beta.beta01.cloud.kavia.ai'
  // If HTTPS proxy is used, clientPort should be 443; otherwise honor PORT/CLI or leave auto.
  const derivedPort = Number(process.env.PORT)
  const isHttpsProxy = String(process.env.VITE_HMR_HTTPS || process.env.HTTPS || '').toLowerCase() === 'true'
  const clientPort = isHttpsProxy ? 443 : (Number.isFinite(derivedPort) && derivedPort > 0 ? derivedPort : undefined)

  return {
    clearScreen: false,
    plugins: [react()],
    server: {
      host: true, // 0.0.0.0
      strictPort: true,
      // Port is controlled by CLI (--port 3000) per orchestrator; do not hardcode here.
      fs: {
        strict: false,
      },
      watch: {
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
          '../../**',
          '../../../**',
        ],
      },
      hmr: {
        host: hmrHost,
        // Only set clientPort when deterministically needed; undefined lets Vite auto-derive in HTTP setups.
        clientPort,
      },
    },
    configureServer(server) {
      // Health endpoints only; no additional middlewares that alter lifecycle behavior.
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
