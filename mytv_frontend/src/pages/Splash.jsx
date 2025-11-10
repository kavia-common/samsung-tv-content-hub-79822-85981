import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Splash screen page with Ocean Professional theme.
 - Centers a bold "MyTV" line vertically and horizontally.
 - Subtle gradient background with blue/amber accents and soft vignette.
 - Smooth fade-in for background and text.
 - Auto-navigates to /home after exactly 5 seconds; timer cleared on unmount.
 - Focus-safe styling for Tizen TV (no focus traps; outline visible if focused).
 - Fit-to-viewport: content is bounded within the screen without overflow or scrollbars.
*/
export default function Splash() {
  const navigate = useNavigate()
  const location = useLocation()
  const didNavigateRef = useRef(false)

  useEffect(() => {
    // If already on home, do nothing
    if (didNavigateRef.current) return
    const onHome = location.pathname === '/home'
    if (onHome) {
      didNavigateRef.current = true
      return
    }
    // Auto navigate in ~3 seconds for this requirement
    const TIMEOUT_MS = 3000
    let mounted = true
    const t = setTimeout(() => {
      if (!mounted) return
      if (didNavigateRef.current) return
      didNavigateRef.current = true
      navigate('/home', { replace: true })
    }, TIMEOUT_MS)

    return () => {
      mounted = false
      clearTimeout(t)
    }
    // Depend only on navigate and pathname; guard prevents duplicate schedule in StrictMode
  }, [navigate, location.pathname])

  const primary = '#2563EB'
  const secondary = '#F59E0B'

  // Typography scales responsively while remaining within safe bounds.
  const titleSize = 'clamp(48px, 8vw, 128px)'
  const subtitleSize = 'clamp(18px, 3vw, 36px)'

  return (
    <div
      className="grid place-items-center min-h-screen w-full h-full overflow-hidden relative animate-splash-bg-fade"
      style={{
        background:
          'radial-gradient(900px 680px at 50% 22%, rgba(37,99,235,0.36), rgba(11,18,32,0)) , linear-gradient(180deg, rgba(37,99,235,0.10), rgba(17,24,39,0.18)), #0B1220',
      }}
    >
      <div className="max-w-[min(80vw,1200px)] max-h-[min(80vh,700px)] w-full px-6 flex flex-col items-center justify-center origin-center overflow-hidden animate-splash-content-fade">
        <h1
          style={{
            margin: 0,
            fontSize: titleSize,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 1.2,
            color: '#ffffff',
            textShadow: '0 24px 64px rgba(0,0,0,0.70)',
            filter: 'drop-shadow(0 12px 34px rgba(0,0,0,0.45))',
            backgroundImage: `linear-gradient(180deg, #ffffff 0%, #dbeafe 70%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
          }}
          aria-label="MyTV"
          tabIndex={0}
          className="focusable animate-brand-pulse"
        >
          MyTV
        </h1>
        <div
          className="relative text-center max-w-full"
          style={{
            marginTop: 10,
            fontSize: subtitleSize,
            color: '#cbd5e1',
            letterSpacing: 0.4,
          }}
        >
          Ocean Professional
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -8,
              width: 100,
              height: 3,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${secondary}, ${primary})`,
              boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            }}
          />
        </div>
      </div>

      <div
        aria-hidden
        className="absolute -inset-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(600px 400px at 0% 0%, rgba(0,0,0,0.35), transparent 70%), radial-gradient(600px 400px at 100% 0%, rgba(0,0,0,0.25), transparent 70%), radial-gradient(600px 400px at 0% 100%, rgba(0,0,0,0.25), transparent 70%), radial-gradient(600px 400px at 100% 100%, rgba(0,0,0,0.35), transparent 70%)',
        }}
      />

      <div className="absolute bottom-[18px] right-6 text-[12px] text-white/60 tracking-[0.3px] select-none">
        Allowed hosts: vscode-internal-26938-beta.beta01.cloud.kavia.ai · vscode-internal-33763-beta.beta01.cloud.kavia.ai · vscode-internal-10832-beta.beta01.cloud.kavia.ai · vscode-internal-28347-beta.beta01.cloud.kavia.ai
      </div>
    </div>
  )
}
