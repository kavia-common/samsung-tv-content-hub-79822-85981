import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * PUBLIC_INTERFACE
 * Vite configuration for the Tizen frontend dev/preview servers.
 * - Binds to 0.0.0.0 for external access.
 * - Preferred port is taken from PORT or VITE_PORT env variables, fallback 3000.
 * - strictPort: false, allowing Vite to pick next available port if needed.
 * - Adds a simple /healthz endpoint for readiness probes.
 */
const preferredPort = Number(process.env.PORT || process.env.VITE_PORT || 3000)

// PUBLIC_INTERFACE
export default defineConfig({
  base: '/', // ensure assets resolve from root for Tizen and container probes
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0
    port: preferredPort,
    strictPort: false, // allow fallback (e.g., 3001) if taken; aligns with DEV_SERVER.md
    open: false,
    hmr: {
      host: '0.0.0.0',
    },
  },
  preview: {
    host: true,
    port: preferredPort,
    strictPort: false,
    open: false,
  },
  // PUBLIC_INTERFACE
  /** Expose a /healthz route that returns 200 OK for readiness checks. */
  configureServer(server) {
    return () => {
      server.middlewares.use('/healthz', (_req, res) => {
        res.statusCode = 200
        res.end('OK')
      })
    }
  },
})
