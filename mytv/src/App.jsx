import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './components/Splash.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import NavBar from './components/NavBar.jsx'

/**
 PUBLIC_INTERFACE
 App component providing the main routes and shared top navigation for pages other than Splash.
*/
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route
        path="/home"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/**
 PUBLIC_INTERFACE
 MainLayout renders the persistent NavBar and wraps page content with padding and background.
*/
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-950 fade-in">
      <NavBar />
      <main className="px-4 sm:px-6 lg:px-10 pb-10">{children}</main>
    </div>
  )
}
