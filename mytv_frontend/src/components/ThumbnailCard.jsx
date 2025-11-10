import { forwardRef, useState } from 'react'

/**
 * PUBLIC_INTERFACE
 * ThumbnailCard displays an image and title; supports focus highlight, lazy loading, and graceful fallback.
 */
const ThumbnailCard = forwardRef(function ThumbnailCard({ src, title, onEnter }, ref) {
  const [errored, setErrored] = useState(false)
  const fallback = 'data:image/svg+xml;utf8,'
    + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="150"><rect width="100%" height="100%" fill="#0a0f1f"/><rect x="0" y="0" width="260" height="150" fill="#1f2937"/><text x="12" y="84" fill="#e5e7eb" font-family="Arial" font-size="16" font-weight="700">${(title||'').toString().slice(0,18)}</text></svg>`)

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="focusable card w-[260px] h-[150px] mr-[14px] overflow-hidden relative cursor-pointer"
      role="button"
      aria-label={title}
      onKeyDown={(e) => {
        if (e.keyCode === 13) onEnter?.()
      }}
      onClick={() => onEnter?.()}
    >
      <img
        src={errored ? fallback : src}
        alt={title}
        loading="lazy"
        onError={() => setErrored(true)}
        className="w-full h-full object-cover bg-[#0a0f1f]"
      />
      <div
        className="thumb-title absolute left-0 right-0 bottom-0 px-[10px] py-[6px] text-sm font-bold text-gray-200 bg-gradient-to-b from-[rgba(2,6,23,0)] to-[rgba(2,6,23,0.85)] [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]"
      >
        {title}
      </div>
    </div>
  )
})

export default ThumbnailCard
