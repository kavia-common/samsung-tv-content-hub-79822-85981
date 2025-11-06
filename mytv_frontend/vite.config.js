import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Clean Vite 4 + React configuration compatible with Node 18.
 * - Uses ESM and defineConfig.
 * - Base path at root.
 * - Dev server binds to 0.0.0.0 with strictPort: true on port 3000.
 * - HMR host set to 0.0.0.0.
 * - Preview mirrors dev host/port settings.
 * - Adds /healthz middleware returning 200 OK for readiness checks.
 */
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0
    port: 3000,
    strictPort: true,
    hmr: {
      host: '0.0.0.0',
    },
    // PUBLIC_INTERFACE
    // Provide a simple readiness endpoint at /healthz
    middlewareMode: false,
    allowedHosts:["vscode-internal-26158-beta.beta01.cloud.kavia.ai"]
  },
  preview: {
    host: true, // 0.0.0.0
    port: 3000,
  },
  // PUBLIC_INTERFACE
  /**
   * Adds a /healthz route to return 200 OK.
   * This ensures readiness probes succeed without triggering HMR or restarts.
   */
  configureServer(server) {
    return () => {
      server.middlewares.use('/healthz', (_req, res) => {
        res.statusCode = 200
        res.end('OK')
      })
    }
  },
})
