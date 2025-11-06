import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Splash screen page: centers "MyTV" and navigates to Home after 3 seconds.
*/
export default function Splash() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/home', { replace: true }), 3000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background:
          'radial-gradient(800px 600px at 50% 20%, rgba(37,99,235,0.35), rgba(11,18,32,0)) , linear-gradient(180deg, rgba(37,99,235,0.08), rgba(17,24,39,0.2)), #0B1220',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: 900,
          letterSpacing: 2,
          color: '#ffffff',
          textShadow: '0 24px 60px rgba(0,0,0,0.65)',
        }}
      >
        MyTV
      </div>
      <div style={{ marginTop: 8, color: '#9CA3AF' }}>Ocean Professional</div>
    </div>
  )
}
