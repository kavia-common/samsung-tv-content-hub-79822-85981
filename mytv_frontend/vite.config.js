import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
/**
 * Stable Vite 5 + React configuration aligned with orchestrator/preview.
 * - server.host: true (bind 0.0.0.0); strictPort: false (no premature exit)
 * - allowedHosts includes current preview host
 * - HMR clientPort derived from PORT env (default 3000)
 * - No custom middleware that could terminate or block the process
 */
export default defineConfig(() => {
  const rootDir = process.cwd()
  const srcDir = path.resolve(rootDir, 'src')
  const publicDir = path.resolve(rootDir, 'public')
  const indexHtml = path.resolve(rootDir, 'index.html')

  const allowedHosts = [
    'vscode-internal-39544-beta.beta01.cloud.kavia.ai',
  ]

  const cliPort = process.env.PORT ? Number(process.env.PORT) : undefined
  const hmrClientPort = Number.isFinite(cliPort) ? cliPort : 3000

  return {
    base: '/',
    clearScreen: false,
    plugins: [react()],
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      assetsInlineLimit: 0,
      sourcemap: false,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    server: {
      host: true,
      port: undefined,
      strictPort: false,
      open: false,
      allowedHosts,
      hmr: {
        overlay: true,
        clientPort: hmrClientPort,
      },
      watch: {
        usePolling: false,
        awaitWriteFinish: { stabilityThreshold: 900, pollInterval: 200 },
        // Keep ignores minimal to avoid missing source updates and avoid HMR loops
        ignored: [
          '**/dist/**',
          '**/.git/**',
          '**/node_modules/**',
          '**/post_process_status.lock',
          '**/*.lock',
        ],
      },
      fs: {
        strict: true,
        allow: [srcDir, publicDir, indexHtml],
        deny: ['dist'],
      },
    },
    preview: {
      host: true,
      strictPort: false,
      allowedHosts,
    },
  }
})
