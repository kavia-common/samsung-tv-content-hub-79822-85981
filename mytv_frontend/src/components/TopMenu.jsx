import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTizenKeys } from '../hooks/useTizenKeys.js'

/**
 * PUBLIC_INTERFACE
 * Top menu component with arrow-key navigation for Samsung TV remotes.
 * - Renders four buttons: Home, Login, Settings, My Plan.
 * - Supports 5-way navigation (Left/Right focus; Enter activates).
 * - Visual focus: scale + glow using Ocean Professional theme accents.
 * - Handles hash routes by scrolling to section anchors if present.
 * - Stability: effects are scoped to pathname/focusIndex only (no infinite loops).
 */
export default function TopMenu({ items = [] }) {
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
        try {
          const el = document.getElementById(hash)
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
          }
        } catch {
          // ignore scroll errors during HMR or transient unmounts
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
    // Focusing here is safe; avoid any state updates in response to focus to prevent loops
    el?.focus()
  }, [focusIndex])

  return (
    <div
      ref={containerRef}
      className="h-[88px] px-6 lg:px-10 py-[12px] flex items-center justify-between border-b border-white/10 bg-topmenu-gradient backdrop-blur-md"
      style={{ backgroundColor: 'rgba(15,23,42,0.55)' }}
    >
      <div className="flex items-center gap-4">
        <div className="text-white font-extrabold tracking-[0.6px] text-[24px] lg:text-[28px] animate-brand-pulse">
          MyTV
        </div>
        <div className="hidden sm:block text-xs lg:text-sm text-gray-400">Ocean Professional</div>
      </div>
      <nav className="flex gap-2.5 lg:gap-3.5">
        {items.map((it, idx) => {
          const active = idx === focusIndex
          return (
            <button
              key={it.label}
              className={[
                'focusable group relative',
                'h-11 lg:h-12 min-w-[120px] lg:min-w-[160px] px-[14px] lg:px-[18px] py-[8px] lg:py-[10px]',
                'rounded-[12px] text-white text-base lg:text-lg font-extrabold cursor-pointer transition-transform duration-200 ease-smooth',
                'backdrop-blur-xs',
                active
                  ? 'border border-secondary shadow-glow scale-[1.04] bg-gradient-to-b from-amber-500/20 to-amber-500/10'
                  : 'border border-white/15 shadow-card bg-gradient-to-b from-blue-600/15 to-blue-600/8 hover:shadow-cardHover hover:scale-[1.03]',
              ].join(' ')}
              tabIndex={0}
              onClick={() => goTo(it)}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  goTo(it)
                }
              }}
            >
              <span className="relative z-10">{it.label}</span>
              <span
                aria-hidden
                className={[
                  'pointer-events-none absolute left-2 right-2 -bottom-[6px] h-[3px] rounded-full',
                  'transition-all duration-200 ease-smooth',
                  active ? 'opacity-100 bg-gradient-to-r from-amber-500 to-blue-500' : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500 to-amber-500',
                ].join(' ')}
              />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
