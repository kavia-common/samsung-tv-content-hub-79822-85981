import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './App.jsx'

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
    <AppRouter />
  </StrictMode>,
)
