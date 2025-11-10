import { useEffect, useState, useRef } from 'react'
import { getInfo, play } from '../services/api.js'
import { useTizenKeys } from '../hooks/useTizenKeys.js'

/**
 * PUBLIC_INTERFACE
 * ShowDetails overlay that fetches details from /api/info/{id}, displays title, description, seasons,
 * total_episodes, and supports Enter on Play to call /api/play then navigate to returned URL.
 */
export default function ShowDetails({ id, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const playBtnRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const info = await getInfo(id)
        if (!cancelled) setData(info)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (id) load()
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    // focus Play button as default action
    playBtnRef.current?.focus()
  }, [loading])

  useTizenKeys({
    onBack: () => onClose?.(),
  })

  async function handlePlay() {
    try {
      const url = await play(data?.id || id)
      if (url) {
        // Navigate to the video URL; can be absolute proxied by server or relative.
        window.location.href = url
      }
    } catch (e) {
      setError(e)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={(e) => {
        // Click outside to close
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div
        className="card"
        style={{
          width: 1100,
          minHeight: 520,
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: 18,
          padding: 18,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)), var(--surface)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Poster */}
        <div style={{ width: '100%', height: 500, overflow: 'hidden', borderRadius: 12, background: '#0a0f1f' }}>
          {loading ? (
            <div style={{ width: '100%', height: '100%', animation: 'pulse 1.2s infinite ease-in-out', background: 'rgba(255,255,255,0.06)' }} />
          ) : (
            <img
              src={typeof data?.poster === 'string' ? data.poster : ''}
              alt={typeof data?.name === 'string' ? data.name : (data?.title || 'poster')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
            />
          )}
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            <>
              <div className="card" style={{ height: 28, width: 380, background: 'rgba(255,255,255,0.06)' }} />
              <div className="card" style={{ height: 16, width: '90%', background: 'rgba(255,255,255,0.05)' }} />
              <div className="card" style={{ height: 16, width: '80%', background: 'rgba(255,255,255,0.05)' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{data?.name ?? data?.title}</div>
              <div style={{ color: '#cbd5e1', fontSize: 16 }}>{data?.description}</div>
              <div style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8 }}>
                Seasons: {data?.seasons ?? 0} • Episodes: {data?.total_episodes ?? 0}
              </div>
            </>
          )}

          {error ? (
            <div style={{ color: 'var(--error)', marginTop: 6 }}>
              Failed to load details. Please try again later.
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button
              ref={playBtnRef}
              className="focusable"
              tabIndex={0}
              onClick={handlePlay}
              onKeyDown={(e) => { if (e.keyCode === 13) handlePlay() }}
              style={{
                height: 54,
                minWidth: 160,
                padding: '10px 18px',
                borderRadius: 12,
                border: '1px solid var(--primary)',
                background: 'linear-gradient(180deg, rgba(37,99,235,0.28), rgba(37,99,235,0.16))',
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Play
            </button>
            <button
              className="focusable"
              tabIndex={0}
              onClick={() => onClose?.()}
              onKeyDown={(e) => { if (e.keyCode === 13) onClose?.() }}
              style={{
                height: 54,
                minWidth: 160,
                padding: '10px 18px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse {0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}`}</style>
    </div>
  )
}
