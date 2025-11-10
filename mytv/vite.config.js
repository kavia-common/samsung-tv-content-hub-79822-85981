import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    // Preserve existing settings and add required allowed host
    allowedHosts: [
      'vscode-internal-39544-beta.beta01.cloud.kavia.ai',
    ],
  }
})
