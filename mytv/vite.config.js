import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    allowedHosts: [
      'vscode-internal-39544-beta.beta01.cloud.kavia.ai',
    ],
    watch: {
      ignored: [
        '**/vite.config.*',
        '**/.env',
        '**/.env.*',
        '**/public/assets/**/*.html',
        '**/assets/**/*.html',
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.vite/**',
        '../**',
        '../../**',
        '../../../**',
      ],
    },
    hmr: {
      clientPort: 3000,
    },
  }
})
