import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * PUBLIC_INTERFACE
 * Vite configuration for the Tizen frontend dev/preview servers.
 * - Binds to 0.0.0.0 for external access.
 * - Prefers port from env.PORT (or VITE_PORT) with a default of 3000.
 * - Uses strictPort=false to allow automatic fallback (e.g., 3001) when the preferred port is busy.
 * - Provides a simple /healthz endpoint for readiness probes.
 */
const HOST = process.env.HOST || '0.0.0.0'
const ENV_PORT = Number(process.env.PORT || process.env.VITE_PORT || 3000)

export default defineConfig({
  base: '/', // ensure assets resolve from root for Tizen and container probes
  plugins: [react()],
  optimizeDeps: {
    disabled: true, // avoid crypto/hash issues on some Node versions
  },
  server: {
    host: HOST === '0.0.0.0' || HOST === 'true' ? true : HOST,
    port: ENV_PORT,
    strictPort: false, // allow fallback if preferred is taken
    open: false,
    hmr: {
      host: '0.0.0.0',
    },
    middlewareMode: false,
    allowedHosts: ['vscode-internal-26158-beta.beta01.cloud.kavia.ai'],
  },
  preview: {
    host: HOST === '0.0.0.0' || HOST === 'true' ? true : HOST,
    port: ENV_PORT,
    strictPort: false,
    open: false,
  },
  configureServer(server) {
    // PUBLIC_INTERFACE
    /** Expose a /healthz route that returns 200 OK for readiness checks. */
    return () => {
      server.middlewares.use('/healthz', (req, res) => {
        res.statusCode = 200
        res.end('OK')
      })
    }
  },
})
