import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Splash screen page: displays a prominent "MyTV" title and navigates to Home after ~5.5 seconds.
 - Renders a large, bold, high-contrast "MyTV" title centered on screen.
 - Keeps a subtle Ocean Professional sub-caption.
 - Auto-navigates to /home after a 5500ms delay.
 - Ensures timer is cleared on unmount to avoid memory leaks or repeated navigations.
*/
export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    // Keep the existing 5.5s delay
    const timeoutMs = 5500
    const t = setTimeout(() => {
      navigate('/home', { replace: true })
    }, timeoutMs)

    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background:
          'radial-gradient(900px 680px at 50% 25%, rgba(37,99,235,0.38), rgba(11,18,32,0)) , linear-gradient(180deg, rgba(37,99,235,0.10), rgba(17,24,39,0.18)), #0B1220',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Prominent brand title per Ocean Professional theme */}
      <h1
        style={{
          margin: 0,
          fontSize: 140,
          lineHeight: '1',
          fontWeight: 900,
          letterSpacing: 1.5,
          color: '#ffffff',
          textShadow: '0 28px 72px rgba(0,0,0,0.70)',
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.45))',
        }}
        aria-label="MyTV"
      >
        MyTV
      </h1>
      <div
        style={{
          marginTop: 12,
          fontSize: 20,
          color: '#9CA3AF',
          letterSpacing: 0.4,
        }}
      >
        Ocean Professional
      </div>
    </div>
  )
}
