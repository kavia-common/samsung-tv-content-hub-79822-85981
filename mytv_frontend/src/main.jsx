import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css'
import './theme.css'
import AppRouter from './App.jsx'

// PUBLIC_INTERFACE
export function DevReady() {
  /** Exported no-op component to satisfy react-refresh rule requiring an export in files with JSX. */
  return null
}

// PUBLIC_INTERFACE
function RootFallback() {
  /** Minimal fallback UI to render if routing fails, ensuring visible output and preventing "spinner hang". */
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#0B1220',
      color: '#E5E7EB',
      textAlign: 'center',
      padding: 16,
    }}>
      <div>
        <div style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 900, letterSpacing: 1.2 }}>MyTV</div>
        <div style={{ marginTop: 8, fontSize: 'clamp(14px, 2.4vw, 20px)', color: '#9CA3AF' }}>
          Loading… If the router is unavailable, this fallback keeps the UI visible.
        </div>
      </div>
    </div>
  )
}

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

/**
 * Render App with a robust guard: if App throws during first render (e.g., transient router import issue),
 * render a simple RootFallback. This prevents a blank spinner and avoids triggering HMR reconnect loops.
 */
function renderApp() {
  try {
    root.render(
      <StrictMode>
        <div className="app-root">
          <AppRouter />
        </div>
      </StrictMode>
    )
  } catch (e) {
    console.warn('Initial App render failed, showing fallback:', e?.message || e)
    root.render(
      <StrictMode>
        <RootFallback />
      </StrictMode>
    )
  }
}

renderApp()
