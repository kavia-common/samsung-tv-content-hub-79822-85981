import { useEffect, useMemo, useRef, useState } from 'react'
import { useTizenKeys } from '../hooks/useTizenKeys'
import ThumbnailCard from './ThumbnailCard'

/**
 * PUBLIC_INTERFACE
 * Rail shows a horizontally scrollable list of thumbnails with remote navigation.
 */
export default function Rail({ title, items = [], railIndex = 0, currentRail, setCurrentRail }) {
  const containerRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const isActive = currentRail === railIndex

  // focus first card when this rail becomes active
  useEffect(() => {
    if (!isActive) return
    const el = containerRef.current?.querySelectorAll('[tabindex="0"]')[focusIndex]
    el?.focus()
    // ensure item is scrolled into view
    if (el) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
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
  })

  const cards = useMemo(
    () =>
      items.map((it, idx) => (
        <ThumbnailCard
          key={it.id ?? idx}
          src={it.image}
          title={it.title}
          onEnter={() => {}}
        />
      )),
    [items],
  )

  return (
    <div style={{ marginTop: 18 }}>
      <div className="section-title">{title}</div>
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
        {cards}
      </div>
    </div>
  )
}
