import { forwardRef } from 'react'

/**
 * PUBLIC_INTERFACE
 * ThumbnailCard displays a local image and title; supports focus highlight.
 */
const ThumbnailCard = forwardRef(function ThumbnailCard({ src, title, onEnter }, ref) {
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
      onKeyDown={(e) => {
        if (e.keyCode === 13) onEnter?.()
      }}
      onClick={() => onEnter?.()}
    >
      <img src={src} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
        }}
      >
        {title}
      </div>
    </div>
  )
})

export default ThumbnailCard
