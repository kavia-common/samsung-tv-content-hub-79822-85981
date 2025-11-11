import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Minimal, stable Vite v4 config for React.
 * - No lifecycle guards/keepalives. Only two health endpoints.
 * - Dev server: host 0.0.0.0, strictPort: true, clearScreen: false, fs.strict: false.
 * - Safe watch ignores to prevent restart loops; no polling.
 * - HMR for reverse proxy via secure WebSocket.
 * - Health endpoints: GET /healthz (text 'OK') and GET /api/healthz (JSON).
 */
export default defineConfig(() => {
  return {
    clearScreen: false,
    plugins: [react()],
    server: {
      host: true, // 0.0.0.0
      strictPort: true,
      fs: { strict: false },
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
        host: 'vscode-internal-19531-beta.beta01.cloud.kavia.ai',
        clientPort: 443,
        protocol: 'wss',
      },
    },
    configureServer(server) {
      // Health endpoints only.
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
