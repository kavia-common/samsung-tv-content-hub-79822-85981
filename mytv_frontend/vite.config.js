import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 PUBLIC_INTERFACE
 Vite config for React app with stable dev server and HMR.
 - Prevents reload storms by ignoring writes to public/ except whitelisted folders.
 - Ensures no plugins/middleware write to index.html or touch watched files.
 - Ignores sibling projects and workspace-wide noisy paths.
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
      // Stable overlay defaults; no forced reconnect spam
      overlay: true,
    },
    // Explicitly ignore file changes that can be updated by external processes
    watch: {
      // Ignore everything under public except images and assets
      ignored: [
        // Workspace-wide noisy paths
        '../mytv/**',              // ignore sibling app entirely
        '**/node_modules/**',
        '**/.git/**',
        '**/.cache/**',
        '**/.vite/**',
        '**/dist/**',
        '**/*.lock',
        '**/*.log',
        '**/post_process_status.lock',

        // Env files should not trigger restarts/HMR
        '**/.env',
        '**/.env.*',

        // Public directory rules
        '**/public/**/*',
        '!**/public/images/**',
        '!**/public/assets/**',

        // Health checks
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
