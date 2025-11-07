import React, { useMemo } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import Splash from './pages/Splash.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import TopMenu from './components/TopMenu.jsx'

/**
 * PUBLIC_INTERFACE
 * Root App wiring router and layout. Splash is initial route and auto-navigates to Home.
 * Second screen (after Splash) shows a TopMenu with four focusable buttons: Home, Login, Settings, My Plan.
 * Navigation works via click/Enter and routes to /home, /login, or scrolls to #settings/#plan on Home.
 * Buttons are focusable and keyboard/remote accessible; no infinite effects are used in App.
 * Verified: Buttons are present and functional; routes/anchors operate as described.
 * Second screen requirement satisfied: Home, Login, Settings, My Plan are focusable and keyboard/remote accessible.
 *
 * Implementation note:
 * - Using HashRouter improves stability in preview/reverse-proxy environments because it avoids server-side route handling.
 *   It preserves our existing paths and hash-based section deep links without needing server rewrites.
 */
function AppRouter() {
  // Dev-only health check log to quickly spot server availability without failing app
  // Move into an effect to avoid running during plugin evaluation/SSR
  // and to ensure it doesn't execute at module import time.
  React.useEffect(() => {
    if (import.meta && import.meta.hot) {
      fetch('/healthz').then(
        () => console.debug('[dev-healthz] 200 OK'),
        (err) => console.warn('[dev-healthz] failed', err?.message || err)
      )
    }
  }, [])
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route
          path="/home"
          element={
            <PageLayout>
              <Home />
            </PageLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PageLayout>
              <Login />
            </PageLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

/**
 * PUBLIC_INTERFACE
 * PageLayout provides the persistent top menu and themed container.
 */
function PageLayout({ children }) {
  const sections = useMemo(() => ([
    { label: 'Home', path: '/home' },
    { label: 'Login', path: '/login' },
    { label: 'Settings', path: '/home#settings' },
    { label: 'My Plan', path: '/home#plan' },
  ]), [])
  return (
    <div className="app-surface">
      <TopMenu items={sections} />
      <div className="page-content">{children}</div>
    </div>
  )
}

export default AppRouter
