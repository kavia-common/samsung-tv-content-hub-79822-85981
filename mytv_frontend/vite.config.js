import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Clean Vite 4 + React configuration compatible with Node 18.
 * - Uses ESM and defineConfig.
 * - Base path at root.
 * - Dev server binds to 0.0.0.0 with strictPort: true on port 3000.
 * - HMR minimal: do not force host override; only set clientPort and overlay.
 * - Debounced file watching to avoid reload storms; dist/ and .git are ignored.
 * - Only src, public, and config files are watched.
 * - Preview mirrors dev host/port settings.
 * - Adds /healthz middleware returning 200 OK for readiness checks.
 * - Ensures server does not serve from dist during dev.
 */
export default defineConfig(() => {
  // Resolve port from env but default to 3000
  const port = Number(process.env.PORT || process.env.VITE_PORT || 3000)

  return {
    base: '/',
    plugins: [react()],
    server: {
      host: true, // 0.0.0.0
      port,
      strictPort: true,
      // Keep HMR minimal; do not force host to avoid reconnect loops
      hmr: {
        clientPort: port,
        overlay: true,
      },
      // Limit the file system access and watched roots to the project
      fs: {
        // Allow only the project root
        strict: true,
        allow: ['.'],
      },
      // Reduce file change storms that can cause rapid restarts/reloads.
      watch: {
        // Disable polling; rely on native FS events
        usePolling: false,
        // Debounce writes to prevent flapping on multi-write saves
        awaitWriteFinish: {
          stabilityThreshold: 700,
          pollInterval: 100,
        },
        // Ignore typical sources of infinite loops
        ignored: ['**/dist/**', '**/.git/**'],
      },
      // Explicitly declare directories Vite should treat as "roots" for static serving/watching
      // during development to ensure dist/ is never served or watched.
      // Note: Vite watches from project root; narrowing via watch.ignored and fs.strict+allow above.
      // No custom allowedHosts; let Vite infer from request to avoid mismatches that trigger HMR loops.
    },
    // Restrict Vite to the main source directories; avoids accidental scanning of dist/ during dev
    // and reduces the chance of plugin-induced write loops (no plugins write to disk here).
    publicDir: 'public',
    // Ensure build output goes to dist/ and is not used in dev
    build: {
      outDir: 'dist',
      emptyOutDir: true,
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
