import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import './theme.css'
import AppRouter from './App.jsx'

/**
 PUBLIC_INTERFACE
 Entry point: mounts React root and wires the router.
 Notes:
 - No code here should force reloads (e.g., no window.location.reload, no meta-refresh).
 - Use HashRouter to avoid dev server rewrites interacting with health checks.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AppRouter />
    </HashRouter>
  </StrictMode>
)
