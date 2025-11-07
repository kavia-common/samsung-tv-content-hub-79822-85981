import { forwardRef, useState } from 'react'

/**
 * PUBLIC_INTERFACE
 * ThumbnailCard displays an image and title; supports focus highlight, lazy loading, and graceful fallback.
 */
const ThumbnailCard = forwardRef(function ThumbnailCard({ src, title, onEnter }, ref) {
  const [errored, setErrored] = useState(false)
  const fallback = '/src/assets/thumbs/thumb1.svg'

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="focusable card"
      style={{
        width: 260,
        height: 150,
        marginRight: 14,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
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
        style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#0a0f1f' }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '6px 10px',
          fontSize: 14,
          fontWeight: 700,
          color: '#E5E7EB',
          background: 'linear-gradient(180deg, rgba(2,6,23,0), rgba(2,6,23,0.85))',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        {title}
      </div>
    </div>
  )
})

export default ThumbnailCard
