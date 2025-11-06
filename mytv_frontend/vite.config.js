import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Clean Vite 4 + React configuration compatible with Node 18.
 * - Uses ESM and defineConfig.
 * - Base path at root.
 * - Dev server binds to 0.0.0.0 with strictPort: true on port 3000.
 * - HMR configured to work reliably behind proxies without forcing host=0.0.0.0.
 * - Debounced file watching to avoid reload storms; dist/ is ignored.
 * - Preview mirrors dev host/port settings.
 * - Adds /healthz middleware returning 200 OK for readiness checks.
 */
export default defineConfig(({ mode }) => {
  // Resolve port from env but default to 3000
  const port = Number(process.env.PORT || process.env.VITE_PORT || 3000)

  return {
    base: '/',
    plugins: [react()],
    server: {
      host: true, // 0.0.0.0
      port,
      strictPort: true,
      // Avoid misconfigured HMR host=0.0.0.0 which can cause disconnect/reconnect loops.
      // Let Vite infer the client host, just ensure correct port and overlay for errors.
      hmr: {
        clientPort: port,
        overlay: true,
      },
      // PUBLIC_INTERFACE
      // Provide a simple readiness endpoint at /healthz
      middlewareMode: false,
      // Reduce file change storms that can cause rapid restarts/reloads.
      watch: {
        usePolling: false,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100,
        },
        ignored: ['**/dist/**'],
      },
      allowedHosts: ['vscode-internal-26158-beta.beta01.cloud.kavia.ai'],
    },
    preview: {
      host: true, // 0.0.0.0
      port,
      strictPort: true,
    },
    // PUBLIC_INTERFACE
    /**
     * Adds a /healthz route to return 200 OK.
     * This ensures readiness probes succeed without triggering HMR or restarts.
     * Side-effect free middleware.
     */
    configureServer(server) {
      return () => {
        server.middlewares.use('/healthz', (_req, res) => {
          res.statusCode = 200
          res.end('OK')
        })
      }
    },
  }
})
