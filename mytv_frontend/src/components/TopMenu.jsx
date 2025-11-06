import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTizenKeys } from '../hooks/useTizenKeys'

/**
 * PUBLIC_INTERFACE
 * Top menu component with arrow-key navigation for Samsung TV remotes.
 */
export default function TopMenu({ items }) {
  const containerRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // sync focus with current route when route changes
    const idx = items.findIndex(i => location.pathname.startsWith(i.path.replace(/#.+$/,'')))
    if (idx >= 0) setFocusIndex(idx)
  }, [location.pathname, items])

  useTizenKeys({
    onLeft: () => setFocusIndex(i => Math.max(0, i - 1)),
    onRight: () => setFocusIndex(i => Math.min(items.length - 1, i + 1)),
    onEnter: () => {
      const it = items[focusIndex]
      if (it) navigate(it.path)
    },
  })

  useEffect(() => {
    const el = containerRef.current?.querySelectorAll('button')[focusIndex]
    el?.focus()
  }, [focusIndex])

  return (
    <div
      ref={containerRef}
      style={{
        height: 88,
        padding: '14px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(180deg, rgba(2,6,23,0.95), rgba(2,6,23,0.75))',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: 0.6 }}>
          MyTV
        </div>
        <div style={{ width: 8 }} />
        <div style={{ fontSize: 14, color: '#9CA3AF' }}>Ocean Professional</div>
      </div>
      <nav style={{ display: 'flex', gap: 14 }}>
        {items.map((it, idx) => {
          const active = idx === focusIndex
          return (
            <button
              key={it.label}
              className="focusable"
              onClick={() => navigate(it.path)}
              style={{
                height: 48,
                minWidth: 140,
                padding: '10px 16px',
                borderRadius: 10,
                border: `1px solid ${active ? 'var(--secondary)' : 'rgba(255,255,255,0.1)'}`,
                background: active
                  ? 'linear-gradient(180deg, rgba(245,158,11,0.25), rgba(245,158,11,0.12))'
                  : 'rgba(255,255,255,0.04)',
                color: active ? '#fff' : '#E5E7EB',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {it.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
