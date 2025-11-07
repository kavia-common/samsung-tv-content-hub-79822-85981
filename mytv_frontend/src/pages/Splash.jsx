import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Splash screen page with Ocean Professional theme.
 - Centers a bold "MyTV" line vertically and horizontally.
 - Subtle gradient background with blue/amber accents and soft vignette.
 - Smooth fade-in for background and text.
 - Auto-navigates to /home after ~5.5s; timer cleared on unmount.
 - Focus-safe styling for Tizen TV (no focus traps; outline visible if focused).
 - Reduced visual footprint vs previous version (about 40–60% smaller) via responsive container with max-width and scale.
*/
export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timeoutMs = 5500
    let mounted = true
    const t = setTimeout(() => {
      if (mounted) navigate('/home', { replace: true })
    }, timeoutMs)
    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [navigate])

  const primary = '#2563EB'
  const secondary = '#F59E0B'

  // Use a responsive container size to scale across 1080p and 4K
  // - Base "viewport" is 1920x1080; we keep the app fixed there via index.html/meta,
  //   but still make the splash content container size explicit and centered.
  // - Max width constrains text size visually and remains centered on all displays.
  const containerMaxWidth = 720 // Previously ~full width title; now reduced footprint
  const titleFontSize = 96      // Previously 150; ~36% reduction
  const subtitleFontSize = 20   // Slightly reduced

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(900px 680px at 50% 22%, rgba(37,99,235,0.36), rgba(11,18,32,0)) , linear-gradient(180deg, rgba(37,99,235,0.10), rgba(17,24,39,0.18)), #0B1220',
        animation: 'splash-bg-fade 900ms ease-out forwards',
      }}
    >
      {/* Centered, scaled content wrapper */}
      <div
        style={{
          width: '100%',
          maxWidth: containerMaxWidth,
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateZ(0)',
          animation: 'splash-content-fade 950ms ease-out 100ms both',
        }}
      >
        {/* Middle line "MyTV" (kept as the prominent center line) */}
        <h1
          style={{
            margin: 0,
            fontSize: titleFontSize,
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
            fontSize: subtitleFontSize,
            color: '#cbd5e1',
            letterSpacing: 0.4,
            position: 'relative',
            textAlign: 'center',
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
        ].join('\\n')
        return css
      })()}</style>
    </div>
  )
}
