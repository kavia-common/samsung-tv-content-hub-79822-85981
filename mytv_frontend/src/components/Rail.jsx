import { useEffect, useMemo, useRef, useState } from 'react'
import { useTizenKeys } from '../hooks/useTizenKeys.js'
import ThumbnailCard from './ThumbnailCard.jsx'

/**
 * PUBLIC_INTERFACE
 * Rail shows a horizontally scrollable list of thumbnails with remote navigation.
 * - Expects items normalized as { id, name, poster } (strict) and will gracefully handle missing fields.
 * - Keyboard: Left/Right moves within the rail; Up/Down changes rail; Enter opens details for the focused card.
 * - Images are lazy-loaded in ThumbnailCard and gracefully handle proxied absolute poster URLs via fallback in the card.
 */
export default function Rail({ title, items = [], railIndex = 0, currentRail, setCurrentRail, onOpenDetails, loading = false, error = null }) {
  const containerRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const isActive = currentRail === railIndex

  // focus first card when this rail becomes active
  useEffect(() => {
    if (!isActive) return
    const nodes = containerRef.current?.querySelectorAll('[tabindex="0"]')
    const hasNodes = nodes && nodes.length > 0
    if (!hasNodes) return
    const safeIndex = Math.min(Math.max(0, focusIndex), nodes.length - 1)
    const el = nodes[safeIndex]
    if (el && typeof el.focus === 'function') {
      try {
        el.focus()
        if (typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
        }
      } catch {
        // No-op: focus/scroll can throw if element unmounted during HMR
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

  // Tolerate both normalized and raw API shapes; avoid crashes on missing fields.
  const cards = useMemo(
    () =>
      items.map((it, idx) => {
        const titleText = it?.name ?? ''
        const imgSrc = it?.poster ?? ''
        return (
          <ThumbnailCard
            key={it?.id ?? idx}
            src={imgSrc}
            title={titleText}
            onEnter={() => onOpenDetails?.(it)}
          />
        )
      }),
    [items, onOpenDetails],
  )

  return (
    <div className="mt-4.5">
      <div className="section-title">{title}</div>
      {error ? (
        <div className="text-gray-400 ml-2 mb-2">
          Failed to load. Please try again later.
        </div>
      ) : null}
      <div
        ref={containerRef}
        className="flex overflow-x-auto overflow-y-hidden px-2 py-2 pl-2.5 gap-0 [scrollbar-width:none]"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`s-${idx}`}
                className="card w-[260px] h-[150px] mr-[14px] bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.09)_37%,rgba(255,255,255,0.05)_63%)] bg-[length:400%_100%] animate-shimmer"
              />
            ))
          : cards}
      </div>
    </div>
  )
}
