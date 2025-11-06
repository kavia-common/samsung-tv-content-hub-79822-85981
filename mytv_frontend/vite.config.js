import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * PUBLIC_INTERFACE
 * Vite configuration for the Tizen frontend dev/preview servers.
 * Ensures the dev server binds to 0.0.0.0 on port 3000 so external health checks can detect readiness.
 * Optimizer is explicitly disabled to avoid Node 20-only crypto.hash usage in some environments.
 * Adds a simple /healthz endpoint for readiness probes.
 */
export default defineConfig({
  base: '/', // ensure assets resolve from root for Tizen and container probes
  plugins: [react()],
  optimizeDeps: {
    disabled: true,
  },
  server: {
    // Bind to all interfaces so container orchestration can access the server
    host: true, // equivalent to 0.0.0.0
    port: 3000,
    strictPort: true, // fail if 3000 is occupied to surface issues clearly
    open: false,
    hmr: {
      host: '0.0.0.0',
    },
    // Provide a simple readiness endpoint
    middlewareMode: false,
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
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
