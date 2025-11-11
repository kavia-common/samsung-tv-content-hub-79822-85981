import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Minimal, stable Vite v4 config for React, with zero lifecycle guards and no keepalive timers.
 * Only two health middlewares are registered: GET /healthz and GET /api/healthz.
 */
export default defineConfig({
  clearScreen: false,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    fs: { strict: false },
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
    hmr: {
      host: 'vscode-internal-19531-beta.beta01.cloud.kavia.ai',
      clientPort: 443,
      protocol: 'wss',
    },
  },
  configureServer(server) {
    // Health endpoints only; no logs, no guards, no timers.
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
    host: '0.0.0.0',
    strictPort: true,
  },
})
