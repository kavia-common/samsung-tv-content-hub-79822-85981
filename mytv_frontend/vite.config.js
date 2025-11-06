import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * PUBLIC_INTERFACE
 * Vite configuration for the Tizen frontend dev/preview servers.
 * Ensures the dev server binds to 0.0.0.0 on port 3000 so external health checks can detect readiness.
 * Optimizer is explicitly disabled to avoid Node 20-only crypto.hash usage in some environments.
 */
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    disabled: true,
  },
  server: {
    // Bind to all interfaces so container orchestration can access the server
    host: true, // equivalent to 0.0.0.0
    port: 3000,
    strictPort: true, // fail if 3000 is occupied to surface issues clearly
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
  },
})
