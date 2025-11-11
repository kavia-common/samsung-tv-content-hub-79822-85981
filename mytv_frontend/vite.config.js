import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Minimal Vite v4 config for React.
 * - Standard fields only; no lifecycle guards, keepalive timers, or server.close interceptions.
 * - Dev server: host 0.0.0.0 (host: true), strictPort: true, clearScreen: false, fs.strict: false.
 * - Watch ignores safe, non-source churn paths.
 * - HMR configured for reverse proxy with secure WebSocket.
 * - Health endpoints: GET /healthz (text) and GET /api/healthz (json).
 */
export default defineConfig(() => {
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
      // Enforce stable HMR over proxy
      hmr: {
        host: 'vscode-internal-19531-beta.beta01.cloud.kavia.ai',
        clientPort: 443,
        protocol: 'wss',
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
