import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './index.css'
import './theme.css'
import Splash from './pages/Splash.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import TopMenu from './components/TopMenu.jsx'

/**
 * PUBLIC_INTERFACE
 * Root App wiring router and layout. Splash is initial route and auto-navigates to Home.
 */
function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
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
