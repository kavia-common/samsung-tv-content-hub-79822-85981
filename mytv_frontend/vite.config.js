import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 PUBLIC_INTERFACE
 Vite config for React app with stable dev server and HMR.
 - Prevents reload storms by ignoring writes to public/ except whitelisted folders.
 - Ensures no plugins/middleware write to index.html or touch watched files.
*/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Let orchestrator choose/override; don't fail if 3000 is busy
    strictPort: false,
    allowedHosts: ['vscode-internal-39544-beta.beta01.cloud.kavia.ai'],
    hmr: {
      // Use a stable default 3000; allow override via PORT
      clientPort: process.env.PORT ? Number(process.env.PORT) : 3000,
    },
    // Explicitly ignore file changes that can be updated by external processes
    watch: {
      // Ignore everything under public except images and assets
      ignored: [
        '**/dist/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/*.lock',
        '**/*.log',
        '**/post_process_status.lock',
        '**/public/**/*',
        '!**/public/images/**',
        '!**/public/assets/**',
        // Health checks or ping files that may be touched by orchestrator
        '**/public/healthz',
        '**/public/healthz/**',
      ],
    },
  },
  preview: {
    host: true,
    strictPort: false,
    allowedHosts: ['vscode-internal-39544-beta.beta01.cloud.kavia.ai'],
  },
})
