import { useEffect, useMemo, useRef, useState } from 'react'
import Banner from '../components/Banner.jsx'
import Rail from '../components/Rail.jsx'
import Subscriptions from '../components/Subscriptions.jsx'
import ShowDetails from '../components/ShowDetails.jsx'
import { getFeatured, getRail } from '../services/api.js'

/**
 PUBLIC_INTERFACE
 Home page consumes API endpoints to render featured and content rails with TV-friendly navigation.
*/
export default function Home() {
  const [currentRail, setCurrentRail] = useState(0)
  const [featured, setFeatured] = useState(null)
  const [featuredError, setFeaturedError] = useState(null)
  const [rails, setRails] = useState([
    { key: 'trending', title: 'Trending', items: [], loading: true, error: null, path: '/api/trending' },
    { key: 'continue', title: 'Continue Watching', items: [], loading: true, error: null, path: '/api/continue_watching' },
    { key: 'action', title: 'Action', items: [], loading: true, error: null, path: '/api/action' },
    { key: 'family', title: 'Family', items: [], loading: true, error: null, path: '/api/family' },
    { key: 'comedy', title: 'Comedy', items: [], loading: true, error: null, path: '/api/comedy' },
    { key: 'horror', title: 'Horror', items: [], loading: true, error: null, path: '/api/horror' },
    { key: 'drama', title: 'Drama', items: [], loading: true, error: null, path: '/api/drama' },
  ])
  const [detailsId, setDetailsId] = useState(null)

  const scrollAreaRef = useRef(null)

  // Load featured banner
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setFeaturedError(null)
        const f = await getFeatured()
        if (!cancelled) setFeatured(f)
      } catch (e) {
        if (!cancelled) setFeaturedError(e)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Load all rails in parallel
  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      try {
        const results = await Promise.all(
          rails.map(async (r) => {
            try {
              const items = await getRail(r.path)
              return { ...r, items: Array.isArray(items) ? items : [], loading: false, error: null }
            } catch (e) {
              return { ...r, items: [], loading: false, error: e }
            }
          })
        )
        if (!cancelled) setRails(results)
      } catch {
        // swallow, individual rail errors are handled per rail
      }
    }
    loadAll()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Anchor scrolling on hash
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.location.hash : ''
    const hash = raw ? raw.replace('#', '') : ''
    if (!hash) return
    const el = document.getElementById(hash)
    if (el && typeof el.scrollIntoView === 'function') {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' }), 60)
    }
  }, [])

  const bannerProps = useMemo(() => {
    if (!featured) return { image: '/images/banner.svg', title: 'Featured', subtitle: '' }
    return {
      image: featured.image || '/images/banner.svg',
      title: featured.title || 'Featured',
      subtitle: '',
    }
  }, [featured])

  function handleOpenDetails(item) {
    setDetailsId(item?.id)
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%', overflow: 'hidden' }}>
        <h1
          style={{
            margin: '6px 0 0 6px',
            padding: '0 2px 0 2px',
            fontSize: 42,
            lineHeight: '48px',
            fontWeight: 900,
            letterSpacing: 0.6,
            color: '#ffffff',
            textShadow: '0 10px 30px rgba(0,0,0,0.45)',
          }}
        >
          MyTV
        </h1>

        <Banner
          image={bannerProps.image}
          title={bannerProps.title}
          subtitle={bannerProps.subtitle}
          onWatch={() => {
            if (featured?.id) setDetailsId(featured.id)
          }}
        />

        {featuredError ? (
          <div style={{ color: 'var(--muted)', marginLeft: 8 }}>
            Failed to load featured.
          </div>
        ) : null}

        <div ref={scrollAreaRef} style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
          {rails.map((r, idx) => (
            <Rail
              key={r.key}
              title={r.title}
              items={r.items}
              railIndex={idx}
              currentRail={currentRail}
              setCurrentRail={setCurrentRail}
              onOpenDetails={handleOpenDetails}
              loading={r.loading}
              error={r.error}
            />
          ))}

          <section id="settings" style={{ marginTop: 24 }}>
            <div className="section-title">Settings</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {['Audio', 'Subtitles', 'Parental Controls', 'Network', 'About'].map((label) => (
                <button
                  key={label}
                  className="focusable card"
                  tabIndex={0}
                  style={{
                    height: 56,
                    minWidth: 220,
                    padding: '10px 18px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'linear-gradient(180deg, rgba(37,99,235,0.18), rgba(37,99,235,0.08))',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section id="plan" style={{ marginTop: 28, marginBottom: 16 }}>
            <div className="section-title">My Plan</div>
            <Subscriptions />
          </section>
        </div>
      </div>

      {detailsId ? <ShowDetails id={detailsId} onClose={() => setDetailsId(null)} /> : null}
    </div>
  )
}
