import { useEffect, useRef } from 'react'

/**
 * PUBLIC_INTERFACE
 * Banner displays a hero image with gradient overlay and text.
 */
export default function Banner({ image = '/src/assets/banners/hero-ocean.svg', title = 'Featured', subtitle = '', onWatch }) {
  const btnRef = useRef(null)

  useEffect(() => {
    // focus first CTA when page loads to give a starting point for remote navigation
    btnRef.current?.focus()
  }, [])

  return (
    <div
      className="banner-shadowed"
      style={{
        width: '100%',
        height: 360,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.06)',
        background: '#0a0f1f',
      }}
    >
      <img
        src={image}
        alt="Banner"
        loading="lazy"
        onError={(e)=>{ e.currentTarget.style.visibility = 'hidden' }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.05) contrast(1.05)' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.55) 40%, rgba(2,6,23,0.2) 70%, rgba(2,6,23,0.0) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 36,
          top: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxWidth: 820,
        }}
      >
        <div style={{ color: '#93C5FD', fontWeight: 700, letterSpacing: 1 }}>MyTV ORIGINAL</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: 'white', textShadow: '0 6px 18px rgba(0,0,0,0.65)' }}>
          {title}
        </div>
        <div style={{ fontSize: 20, color: '#D1D5DB' }}>{subtitle}</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          <button
            ref={btnRef}
            className="focusable"
            style={{
              height: 54,
              minWidth: 160,
              padding: '10px 18px',
              borderRadius: 12,
              border: '1px solid var(--primary)',
              background: 'linear-gradient(180deg, rgba(37,99,235,0.28), rgba(37,99,235,0.16))',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
              cursor: 'pointer',
            }}
            onClick={() => onWatch?.()}
            onKeyDown={(e)=>{ if(e.keyCode===13) onWatch?.() }}
          >
            Watch Now
          </button>
          <button
            className="focusable"
            style={{
              height: 54,
              minWidth: 160,
              padding: '10px 18px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => {}}
          >
            Add to List
          </button>
        </div>
      </div>
    </div>
  )
}
