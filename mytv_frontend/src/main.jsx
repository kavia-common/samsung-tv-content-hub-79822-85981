import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css'
import './theme.css'
import AppRouter from './App.jsx'

/**
 * Entry module: mounts a single React root with no named exports.
 * Avoids import-time side effects other than optional debug attribute.
 */

// Optional, non-fatal debug outlines toggle
try {
  const flag = (import.meta?.env?.VITE_DEBUG_OUTLINES ?? '').toString().trim()
  if (flag === '1' || flag.toLowerCase() === 'true') {
    document.body.setAttribute('data-debug', '1')
  }
} catch { /* noop */ }

// Create or reuse a single root (stable across HMR)
const mountEl = document.getElementById('root')
if (!mountEl) {
  throw new Error('Root element #root not found in index.html')
}
let root = mountEl._reactRoot || null
if (!root) {
  root = createRoot(mountEl)
  Object.defineProperty(mountEl, '_reactRoot', { value: root, writable: false })
}

// Render App with safety guard to avoid unhandled exceptions terminating HMR
try {
  root.render(
    <StrictMode>
      <div className="app-root">
        <AppRouter />
      </div>
    </StrictMode>
  )
} catch { /* noop */ }
