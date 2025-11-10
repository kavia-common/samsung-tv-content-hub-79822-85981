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
  root: process.cwd(),
  plugins: [react()],
  publicDir: 'public',
  server: {
    host: true,
    allowedHosts: ['vscode-internal-39544-beta.beta01.cloud.kavia.ai'],
    watch: {
      ignored: [
        '../**',
        '../../**',
        '**/public/assets/**/*.html',
        '**/assets/**/*.html',
        '**/.env*',
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.vite/**',
      ],
    },
    hmr: {
      clientPort: 3000,
    },
  },
})
