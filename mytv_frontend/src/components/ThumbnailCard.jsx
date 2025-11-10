import { forwardRef, useMemo, useState } from 'react'

/**
 * PUBLIC_INTERFACE
 * ThumbnailCard displays an image and title; supports focus highlight, lazy loading, and graceful fallback.
 */
const ThumbnailCard = forwardRef(function ThumbnailCard({ src, title, onEnter }, ref) {
  const [errored, setErrored] = useState(false)

  const fallback = useMemo(() => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="150">` +
      `<rect width="100%" height="100%" fill="#0a0f1f"/>` +
      `<rect x="0" y="0" width="260" height="150" fill="#1f2937"/>` +
      `<text x="12" y="84" fill="#e5e7eb" font-family="Arial" font-size="16" font-weight="700">${String(title||'').slice(0,18)}</text>` +
      `</svg>`
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
  }, [title])

  const safeSrc = errored || !src ? fallback : src

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={[
        'focusable group relative cursor-pointer mr-[14px] snap-start',
        'w-[260px] aspect-video overflow-hidden rounded-xl',
        'ring-1 ring-slate-700/60 hover:ring-2 hover:ring-slate-400/60',
        'shadow-card hover:shadow-cardHover transition-all duration-200 ease-smooth',
      ].join(' ')}
      role="button"
      aria-label={title}
      onKeyDown={(e) => {
        if (e.keyCode === 13) onEnter?.()
      }}
      onClick={() => onEnter?.()}
    >
      <img
        src={safeSrc}
        alt={title}
        loading="lazy"
        onError={() => setErrored(true)}
        className="w-full h-full object-cover bg-[#0a0f1f] group-hover:scale-[1.03] transition-transform duration-300 ease-smooth"
      />
      <div
        className="thumb-title absolute left-0 right-0 bottom-0 px-[10px] py-[6px] text-[13px] font-bold text-gray-100 bg-gradient-to-b from-[rgba(2,6,23,0)] to-[rgba(2,6,23,0.85)] [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]"
      >
        <span className="inline-block translate-y-1 opacity-90 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-smooth">
          {title}
        </span>
      </div>
    </div>
  )
})

export default ThumbnailCard
