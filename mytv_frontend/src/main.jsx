import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import './theme.css'
import AppRouter from './App.jsx'

/**
 PUBLIC_INTERFACE
 Entry point: mounts React root and wires the router.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AppRouter />
    </HashRouter>
  </StrictMode>
)
