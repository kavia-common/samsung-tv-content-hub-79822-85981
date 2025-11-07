import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css'
import AppRouter from './App.jsx'

// Enable optional debug outlines via env flag VITE_DEBUG_OUTLINES
try {
  const flag = (import.meta?.env?.VITE_DEBUG_OUTLINES ?? '').toString().trim()
  if (flag === '1' || flag.toLowerCase() === 'true') {
    document.body.setAttribute('data-debug', '1')
  }
} catch { /* non-fatal */ }

// Simple heartbeat to confirm the app keeps running during dev
if (import.meta && import.meta.hot) {
  const HEARTBEAT_MS = 15000
  setInterval(() => {
    // Keep it concise and identifiable for CI capture
    console.debug('[dev-heartbeat] app alive')
  }, HEARTBEAT_MS)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="app-root">
      <AppRouter />
    </div>
  </StrictMode>,
)
