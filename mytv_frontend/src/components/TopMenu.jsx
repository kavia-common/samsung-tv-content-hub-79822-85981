import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTizenKeys } from '../hooks/useTizenKeys'

/**
 * PUBLIC_INTERFACE
 * Top menu component with arrow-key navigation for Samsung TV remotes.
 * - Renders four buttons: Home, Login, Settings, My Plan.
 * - Supports 5-way navigation (Left/Right focus; Enter activates).
 * - Visual focus: scale + glow using Ocean Professional theme accents.
 * - Handles hash routes by scrolling to section anchors if present.
 */
export default function TopMenu({ items }) {
  const containerRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  // Memoize base paths to avoid re-computing and effect churn if items array identity changes
  const itemBasePaths = useMemo(
    () => (Array.isArray(items) ? items.map(i => String(i?.path || '')?.replace(/#.+$/, '')) : []),
    [items]
  )

  // Sync focus to route path (ignoring hash) - depends on pathname and stable base paths
  useEffect(() => {
    const basePath = location.pathname
    const idx = itemBasePaths.findIndex(p => p && basePath.startsWith(p))
    if (idx >= 0) setFocusIndex(idx)
  }, [location.pathname, itemBasePaths])

  function goTo(item) {
    if (!item) return
    navigate(item.path)
    const hash = item.path.split('#')[1]
    if (hash) {
      // Allow content to render before attempting scroll into view
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
        }
      }, 50)
    }
  }

  useTizenKeys({
    onLeft: () => setFocusIndex(i => Math.max(0, i - 1)),
    onRight: () => setFocusIndex(i => Math.min(items.length - 1, i + 1)),
    onEnter: () => {
      const it = items[focusIndex]
      goTo(it)
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
              tabIndex={0}
              onClick={() => goTo(it)}
              style={{
                height: 48,
                minWidth: 160,
                padding: '10px 18px',
                borderRadius: 12,
                border: `1px solid ${active ? 'var(--secondary)' : 'rgba(255,255,255,0.14)'}`,
                background: active
                  ? 'linear-gradient(180deg, rgba(245,158,11,0.25), rgba(245,158,11,0.12))'
                  : 'linear-gradient(180deg, rgba(37,99,235,0.18), rgba(37,99,235,0.10))',
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: active
                  ? '0 0 0 3px rgba(245,158,11,0.35), 0 14px 34px rgba(0,0,0,0.40)'
                  : '0 10px 24px rgba(0,0,0,0.35)',
                transform: active ? 'scale(1.05)' : 'scale(1.0)',
                transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  goTo(it)
                }
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
