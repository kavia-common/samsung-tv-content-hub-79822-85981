import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'
import fs from 'fs'

/**
 PUBLIC_INTERFACE
 Vite config for React app with stable dev server and HMR.
 - Explicitly sets root to this project directory only.
 - Prevents reload storms by ignoring siblings and workspace-level noisy paths.
 - Ignores HTML under public/assets and assets, and any .env changes.
 - Adds absolute-path ignores for this vite.config.js and the sibling mytv project’s config, plus workspace root.
 - Avoids dynamic env in config to prevent re-writes or variability (no process.env in HMR clientPort etc.).
*/
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Resolve absolute paths used in watch.ignored to be explicit and robust
const projectRoot = __dirname // samsung-tv-content-hub-79822-85981/mytv_frontend
const workspaceRoot = path.resolve(projectRoot, '..') // samsung-tv-content-hub-79822-85981
const siblingMyTv = path.join(workspaceRoot, 'mytv')
const thisViteConfig = path.join(projectRoot, 'vite.config.js')
const siblingMyTvVite = path.join(siblingMyTv, 'vite.config.js')

// Compose ignore list with both globs and resolved paths.
// Note: Vite uses chokidar under the hood; ignored accepts globs and functions. Using array of strings is fine.
const ignoredList = [
  // Absolute files/dirs (most important first)
  thisViteConfig,
  siblingMyTv,
  siblingMyTvVite,
  // also ignore any vite config in parent workspace
  path.join(workspaceRoot, 'vite.config.js'),
  workspaceRoot, // ignore workspace root to avoid parent activity triggering
  // Glob fallbacks/patterns inside project
  '**/vite.config.*',
  '**/postcss.config.*',
  '**/tailwind.config.*',
  '**/DEV_SERVER.md',
  // Env files: prefer .env.local; ensure we do not watch any .env*
  '**/.env',
  '**/.env.*',
  // HTML under public/assets and any assets folder HTML
  '**/public/assets/**/*.html',
  '**/assets/**/*.html',
  // Typical noisy/large dirs
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/.vite/**',
  // Parents/siblings (glob)
  '../**',
  '../../**',
  '../../../**',
]

// Defensive: if vite.config.js is a symlink, ignore its real target too.
try {
  const st = fs.lstatSync(thisViteConfig)
  if (st.isSymbolicLink()) {
    const linkTarget = fs.realpathSync(thisViteConfig)
    if (linkTarget && linkTarget !== thisViteConfig) {
      ignoredList.push(linkTarget)
    }
  }
} catch {
  // best effort; do nothing
}

export default defineConfig({
  // Pin the Vite root to this project folder only.
  root: projectRoot,
  plugins: [react()],
  publicDir: 'public',
  server: {
    host: true,
    strictPort: true, // keep port stable during dev; avoids bouncing
    // Only allow our known dev host
    allowedHosts: ['vscode-internal-39544-beta.beta01.cloud.kavia.ai'],
    // Stabilize watcher: no polling, debounce writes, and ignore external paths and this config
    watch: {
      usePolling: false,
      awaitWriteFinish: {
        stabilityThreshold: 350,
        pollInterval: 100,
      },
      ignored: ignoredList,
    },
    hmr: {
      // Fixed value; do not depend on environment variables that can change during sessions
      clientPort: 3000,
    },
  },
})
