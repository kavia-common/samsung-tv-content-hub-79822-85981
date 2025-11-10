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
    // Focusing here is safe; avoid any state updates in response to focus to prevent loops
    el?.focus()
  }, [focusIndex])

  return (
    <div
      ref={containerRef}
      className="h-[88px] px-10 py-[14px] flex items-center justify-between border-b border-white/10 bg-topmenu-gradient backdrop-blur-md"
    >
      <div className="flex items-center gap-4">
        <div className="text-white font-extrabold tracking-[0.6px] text-[28px]">
          MyTV
        </div>
        <div className="w-2" />
        <div className="text-sm text-gray-400">Ocean Professional</div>
      </div>
      <nav className="flex gap-3.5">
        {items.map((it, idx) => {
          const active = idx === focusIndex
          return (
            <button
              key={it.label}
              className={
                [
                  'focusable',
                  'h-12 min-w-[160px] px-[18px] py-[10px] rounded-[12px] text-white text-lg font-extrabold cursor-pointer transition',
                  active
                    ? 'border border-secondary shadow-[0_0_0_3px_rgba(245,158,11,0.35),0_14px_34px_rgba(0,0,0,0.40)] scale-[1.05] bg-gradient-to-b from-amber-500/25 to-amber-500/10'
                    : 'border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.35)] bg-gradient-to-b from-blue-600/20 to-blue-600/10'
                ].join(' ')
              }
              tabIndex={0}
              onClick={() => goTo(it)}
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
