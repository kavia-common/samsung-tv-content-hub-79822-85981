import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Splash screen page: centers "MyTV" and navigates to Home after ~5.5 seconds.
 - Shows the MyTV title centered.
 - Auto-navigates to /home after a 5500ms delay.
 - Ensures timer is cleared on unmount to avoid memory leaks or repeated navigations.
*/
export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    // Use a 5.5s delay to meet the 5–6 seconds requirement
    const timeoutMs = 5500
    const t = setTimeout(() => {
      // Replace history entry so Splash isn't in the back stack
      navigate('/home', { replace: true })
    }, timeoutMs)

    // Cleanup to avoid navigation after unmount and prevent console errors
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
