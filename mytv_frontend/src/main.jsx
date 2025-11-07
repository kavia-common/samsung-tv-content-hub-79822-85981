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

// IMPORTANT: Avoid any dev-only timers or listeners tied to import.meta.hot here,
// as StrictMode double-invocation and HMR dispose cycles can accumulate intervals
// and appear as constant updates.

// Mount React app
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
