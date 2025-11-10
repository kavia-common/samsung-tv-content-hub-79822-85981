import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: false, // allow fallback to avoid premature exit on port contention
    // Preserve existing settings and add required allowed host
    allowedHosts: [
      'vscode-internal-39544-beta.beta01.cloud.kavia.ai',
    ],
    hmr: {
      clientPort: process.env.PORT ? Number(process.env.PORT) : 3000,
    },
  }
})
