import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 PUBLIC_INTERFACE
 Vite config for React app with stable dev server and HMR.
*/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Let orchestrator choose/override; don't fail if 3000 is busy
    strictPort: false,
    allowedHosts: ['vscode-internal-39544-beta.beta01.cloud.kavia.ai'],
    hmr: {
      clientPort: process.env.PORT ? Number(process.env.PORT) : 3000,
    },
  },
  preview: {
    host: true,
    strictPort: false,
    allowedHosts: ['vscode-internal-39544-beta.beta01.cloud.kavia.ai'],
  },
})
