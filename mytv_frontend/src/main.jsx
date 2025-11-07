import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css'
import './theme.css'
import AppRouter from './App.jsx'

// Enable optional debug outlines via env flag VITE_DEBUG_OUTLINES
try {
  const flag = (import.meta?.env?.VITE_DEBUG_OUTLINES ?? '').toString().trim()
  if (flag === '1' || flag.toLowerCase() === 'true') {
    document.body.setAttribute('data-debug', '1')
  }
} catch { /* non-fatal */ }

/* Mount React app (single root). Avoid attaching multiple roots during HMR. */
const mountEl = document.getElementById('root')
if (!mountEl) {
  throw new Error('Root element #root not found in index.html')
}
// Reuse an existing root if one was stashed on the element to prevent duplicate mounts on rare HMR edge cases.
let root = mountEl._reactRoot || null
if (!root) {
  root = createRoot(mountEl)
  // non-enumerable to avoid accidental serialization
  Object.defineProperty(mountEl, '_reactRoot', { value: root, writable: false })
}
root.render(
  <StrictMode>
    <div className="app-root">
      <AppRouter />
    </div>
  </StrictMode>
)
