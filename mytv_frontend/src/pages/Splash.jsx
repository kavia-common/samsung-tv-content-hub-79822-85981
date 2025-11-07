import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Splash screen page with Ocean Professional theme.
 - Centers a large, bold "MyTV" line vertically and horizontally per the provided reference.
 - Subtle gradient background with blue/amber accents and soft vignette.
 - Smooth fade-in for background and text.
 - Auto-navigates to /home after ~5.5s; timer cleared on unmount.
 - Allowed host note (dev-only) is shown subtly at the bottom to reflect current allowed host context.
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

  // Colors from Ocean Professional theme
  const primary = '#2563EB' // blue
  const secondary = '#F59E0B' // amber

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
        // Layered gradients for depth: blue glow + vertical wash + base bg
        background:
          'radial-gradient(900px 680px at 50% 22%, rgba(37,99,235,0.36), rgba(11,18,32,0)) , linear-gradient(180deg, rgba(37,99,235,0.10), rgba(17,24,39,0.18)), #0B1220',
        animation: 'splash-bg-fade 900ms ease-out forwards',
      }}
    >
      {/* Centered content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateZ(0)',
          animation: 'splash-content-fade 950ms ease-out 100ms both',
        }}
      >
        {/* Middle line "MyTV" */}
        <h1
          style={{
            margin: 0,
            fontSize: 150,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 1.4,
            color: '#ffffff',
            textShadow: '0 28px 72px rgba(0,0,0,0.70)',
            filter: 'drop-shadow(0 12px 34px rgba(0,0,0,0.45))',
            // Subtle gradient stroke-like effect using text-fill trick via background-clip
            backgroundImage: `linear-gradient(180deg, #ffffff 0%, #dbeafe 70%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          aria-label="MyTV"
        >
          MyTV
        </h1>
        {/* Sub-caption with amber accent underline */}
        <div
          style={{
            marginTop: 14,
            fontSize: 22,
            color: '#cbd5e1',
            letterSpacing: 0.5,
            position: 'relative',
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

      {/* Keyframes injected inline to keep scope local to Splash */}
      <style>{`
        @keyframes splash-bg-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes splash-content-fade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
