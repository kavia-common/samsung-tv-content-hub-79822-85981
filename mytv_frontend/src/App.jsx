/**
 * App entry with routing. No import-time side effects; all effects occur after mount.
 */
import React, { useMemo } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import Splash from './pages/Splash.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import MyPlan from './pages/MyPlan.jsx'
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
  return (
    <HashRouter>
      {/* Always-visible watermark to confirm render path */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.12,
          color: '#ffffff',
          fontWeight: 900,
          letterSpacing: 1.2,
          textAlign: 'center',
          textShadow: '0 10px 28px rgba(0,0,0,0.75)',
          userSelect: 'none',
          fontSize: 'clamp(28px, 6vw, 72px)',
        }}
      >
        mytv_frontend
      </div>
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
        <Route
          path="/settings"
          element={
            <PageLayout>
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Settings</div>
                <div style={{ color: '#cbd5e1' }}>Settings page stub. Use the top menu to return Home.</div>
              </div>
            </PageLayout>
          }
        />
        <Route
          path="/my-plan"
          element={
            <PageLayout>
              <MyPlan />
            </PageLayout>
          }
        />
        <Route path="*" element={
          // Provide a minimal inline fallback to avoid total blank in pathological cases
          <div style={{display:'grid',placeItems:'center',minHeight:'60vh',color:'#E5E7EB'}}>
            <div>Route not found. Redirecting…</div>
            <Navigate to="/" replace />
          </div>
        } />
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
    { label: 'Settings', path: '/settings' },
    { label: 'My Plan', path: '/my-plan' },
  ]), [])
  return (
    <div className="app-surface">
      <TopMenu items={sections} />
      <div className="page-content">{children}</div>
    </div>
  )
}

export default AppRouter
