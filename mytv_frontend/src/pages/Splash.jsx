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
    if (location.pathname === '/home' || window?.location?.hash?.startsWith('#/home')) {
      didNavigateRef.current = true
      return
    }
    const timeoutMs = 5000
    let mounted = true
    const t = setTimeout(() => {
      if (!mounted) return
      if (didNavigateRef.current) return
      didNavigateRef.current = true
      navigate('/home', { replace: true })
    }, timeoutMs)

    return () => {
      mounted = false
      clearTimeout(t)
    }
    // Depend only on `navigate` so HMR/location minor changes don't restart timer unintentionally
    // navigate is stable from react-router; eslint exhaustive-deps intentionally not applied here
  }, [navigate])

  const primary = '#2563EB'
  const secondary = '#F59E0B'

  // Typography scales responsively while remaining within safe bounds.
  const titleSize = 'clamp(48px, 8vw, 128px)'
  const subtitleSize = 'clamp(18px, 3vw, 36px)'

  return (
    <div
      style={{
        // Grid center ensures content is centered both vertically and horizontally
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        width: '100%',
        height: '100%',
        overflow: 'hidden', // prevent scrollbars
        position: 'relative',
        background:
          'radial-gradient(900px 680px at 50% 22%, rgba(37,99,235,0.36), rgba(11,18,32,0)) , linear-gradient(180deg, rgba(37,99,235,0.10), rgba(17,24,39,0.18)), #0B1220',
        animation: 'splash-bg-fade 900ms ease-out forwards',
      }}
    >
      {/* Inner bounded container that cannot exceed viewport */}
      <div
        style={{
          // Constrain the content to stay within screen
          maxWidth: 'min(80vw, 1200px)',
          maxHeight: 'min(80vh, 700px)',
          width: '100%',
          // Maintain natural flow; no explicit scaling beyond bounds
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'center',
          animation: 'splash-content-fade 950ms ease-out 100ms both',
          overflow: 'hidden',
        }}
      >
        {/* Middle line "MyTV" (kept as the prominent center line) */}
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
          className="focusable"
        >
          MyTV
        </h1>

        {/* Sub-caption with amber/blue underline accent */}
        <div
          style={{
            marginTop: 10,
            fontSize: subtitleSize,
            color: '#cbd5e1',
            letterSpacing: 0.4,
            position: 'relative',
            textAlign: 'center',
            maxWidth: '100%',
          }}
        >
          Ocean Professional
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: -8,
              width: 80,
              height: 3,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${secondary}, ${primary})`,
              boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            }}
          />
        </div>
      </div>

      {/* Soft corner vignettes for a modern cinematic feel */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: -80,
          pointerEvents: 'none',
          background:
            'radial-gradient(600px 400px at 0% 0%, rgba(0,0,0,0.35), transparent 70%), radial-gradient(600px 400px at 100% 0%, rgba(0,0,0,0.25), transparent 70%), radial-gradient(600px 400px at 0% 100%, rgba(0,0,0,0.25), transparent 70%), radial-gradient(600px 400px at 100% 100%, rgba(0,0,0,0.35), transparent 70%)',
        }}
      />

      {/* Dev-only allowed host note for reference (non-intrusive) */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          right: 24,
          fontSize: 12,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: 0.3,
          userSelect: 'none',
        }}
      >
        Allowed host: vscode-internal-26938-beta.beta01.cloud.kavia.ai
      </div>

      {/* Local keyframes for this page */}
      <style>{(function(){
        const css = [
          '@keyframes splash-bg-fade {',
          '  from { opacity: 0; }',
          '  to { opacity: 1; }',
          '}',
          '@keyframes splash-content-fade {',
          '  from { opacity: 0; transform: translateY(12px); }',
          '  to { opacity: 1; transform: translateY(0); }',
          '}'
        ].join('\n')
        return css
      })()}</style>
    </div>
  )
}
