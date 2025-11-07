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

/**
 * Simple heartbeat to confirm the app keeps running during dev.
 * Run only in browser after DOM is ready.
 */
if (typeof window !== 'undefined' && import.meta && import.meta.hot) {
  const HEARTBEAT_MS = 15000
  const startHeartbeat = () => {
    setInterval(() => {
      console.debug('[dev-heartbeat] app alive')
    }, HEARTBEAT_MS)
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startHeartbeat()
  } else {
    window.addEventListener('DOMContentLoaded', startHeartbeat, { once: true })
  }
}

const mountEl = document.getElementById('root')
if (!mountEl) {
  throw new Error('Root element #root not found in index.html')
}
createRoot(mountEl).render(
  <StrictMode>
    <div className="app-root">
      <AppRouter />
    </div>
  </StrictMode>,
)
