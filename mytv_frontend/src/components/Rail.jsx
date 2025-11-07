import { useEffect, useMemo, useRef, useState } from 'react'
import { useTizenKeys } from '../hooks/useTizenKeys.js'
import ThumbnailCard from './ThumbnailCard.jsx'

/**
 * PUBLIC_INTERFACE
 * Rail shows a horizontally scrollable list of thumbnails with remote navigation.
 */
export default function Rail({ title, items = [], railIndex = 0, currentRail, setCurrentRail, onOpenDetails, loading = false, error = null }) {
  const containerRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const isActive = currentRail === railIndex

  // focus first card when this rail becomes active
  useEffect(() => {
    if (!isActive) return
    const nodes = containerRef.current?.querySelectorAll('[tabindex="0"]')
    const el = nodes && nodes.length > 0 ? nodes[focusIndex] : null
    if (el && typeof el.focus === 'function') {
      el.focus()
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [isActive, focusIndex])

  useTizenKeys({
    onLeft: () => {
      if (!isActive) return
      setFocusIndex((i) => Math.max(0, i - 1))
    },
    onRight: () => {
      if (!isActive) return
      setFocusIndex((i) => Math.min(items.length - 1, i + 1))
    },
    onUp: () => setCurrentRail((r) => Math.max(0, r - 1)),
    onDown: () => setCurrentRail((r) => r + 1),
    onEnter: () => {
      if (!isActive) return
      const it = items[focusIndex]
      if (it) onOpenDetails?.(it)
    }
  })

  const skeletons = useMemo(() => {
    return Array.from({ length: 8 }).map((_, idx) => (
      <div
        key={`s-${idx}`}
        className="card"
        style={{
          width: 260,
          height: 150,
          marginRight: 14,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.09) 37%, rgba(255,255,255,0.05) 63%)',
          backgroundSize: '400% 100%',
          animation: 'shimmer 1200ms ease-in-out infinite',
        }}
      />
    ))
  }, [])

  const cards = useMemo(
    () =>
      items.map((it, idx) => (
        <ThumbnailCard
          key={it.id ?? idx}
          src={it.image}
          title={it.title}
          onEnter={() => onOpenDetails?.(it)}
        />
      )),
    [items, onOpenDetails],
  )

  return (
    <div style={{ marginTop: 18 }}>
      <div className="section-title">{title}</div>
      {error ? (
        <div style={{ color: 'var(--muted)', marginLeft: 8, marginBottom: 8 }}>
          Failed to load. Please try again later.
        </div>
      ) : null}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '10px 6px 10px 8px',
          scrollbarWidth: 'none',
          gap: 0,
        }}
      >
        {loading ? skeletons : cards}
      </div>

      <style>{`@keyframes shimmer { 0%{background-position: 200% 0} 100%{background-position: -200% 0} }`}</style>
    </div>
  )
}
