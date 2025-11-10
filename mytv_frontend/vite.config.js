import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 PUBLIC_INTERFACE
 Vite config for React app with stable dev server and HMR.
 - Explicitly sets root to the project directory to ensure only this app is watched.
 - Prevents reload storms by ignoring siblings and workspace-level noisy paths.
 - Ignores HTML under public/assets and assets, and any .env changes.
*/
export default defineConfig({
  // Pin the Vite root to this project folder only.
  root: process.cwd(),
  plugins: [react()],
  publicDir: 'public',
  server: {
    host: true,
    // Only allow our known dev host
    allowedHosts: ['vscode-internal-39544-beta.beta01.cloud.kavia.ai'],
    // Ensure the file watcher does not react to config changes, envs, or sibling/workspace paths
    watch: {
      // Note: picomatch globs are resolved from process.cwd() (the project root).
      ignored: [
        // Ignore this config file and common config files in this project
        '**/vite.config.js',
        '**/postcss.config.js',
        '**/tailwind.config.js',
        '**/DEV_SERVER.md',

        // Ignore env files (do not trigger restarts)
        '**/.env',
        '**/.env.*',

        // Ignore HTML under public/assets and any assets folder HTML
        '**/public/assets/**/*.html',
        '**/assets/**/*.html',

        // Ignore typical noisy/large dirs
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.vite/**',

        // Ignore all parents/siblings to avoid watching outside this app
        '../**',
        '../../**',
        '../../../**',
      ],
    },
    hmr: {
      // Keep a fixed clientPort for stability in our environment
      clientPort: 3000,
    },
  },
})
