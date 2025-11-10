import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner.jsx'
import Rail from '../components/Rail.jsx'
import Subscriptions from '../components/Subscriptions.jsx'
import ShowDetails from '../components/ShowDetails.jsx'
import { fetchMovies, fetchHomeData, getBanner } from '../services/movies.js'

/**
 * PUBLIC_INTERFACE
 * Home page: Top banner, multiple rails populated by API (with local fallback), and subscriptions at bottom.
 * - Uses keyboard-friendly rails with focusable thumbnail cards.
 * - Thumbnails use the provided Poster URL when available.
 */
export default function Home() {
  const [currentRail, setCurrentRail] = useState(0)
  const [details, setDetails] = useState(null)
  const [rails, setRails] = useState([])
  const [banner, setBanner] = useState({ backdrop: '', title: 'Welcome to MyTV', subtitle: 'Enjoy your favorites' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        // fetchMovies() is the new API-aware loader; fetchHomeData() remains for backward-compat.
        const [r, b] = await Promise.all([fetchMovies().catch(() => fetchHomeData()), getBanner()])
        if (!cancelled) {
          setRails(r || [])
          setBanner(b || banner)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="app-main" aria-label="Home">
      <Banner
        image={banner.backdrop}
        title={banner.title}
        subtitle={banner.subtitle}
        onWatch={() => setDetails({
          id: banner.id || 'banner',
          title: banner.title,
          description: 'Featured selection',
          poster: typeof banner.backdrop === 'string' ? banner.backdrop : '',
        })}
      />

      {/* Rails */}
      {rails.map((r, idx) => (
        <Rail
          key={r.title}
          title={r.title}
          items={r.items}
          railIndex={idx}
          currentRail={currentRail}
          setCurrentRail={setCurrentRail}
          onOpenDetails={(it) => setDetails({
            id: it?.id,
            title: (typeof it?.name === 'string' && it.name) ? it.name : (typeof it?.title === 'string' ? it.title : 'Selection'),
            poster: (typeof it?.poster === 'string' ? it.poster : ''),
            description: 'Selection',
          })}
          loading={loading}
          error={error}
        />
      ))}

      {/* Settings and Plan anchors for top menu deep links */}
      <section id="settings" className="mt-7">
        <div className="section-title">Settings</div>
        <div className="card p-4">
          This is a placeholder for Settings. Navigate with the top menu.
        </div>
      </section>

      <section id="plan" className="mt-7">
        <div className="section-title">My Plan</div>
        <Subscriptions />
      </section>

      {details ? (
        <ShowDetails
          id={details.id}
          onClose={() => setDetails(null)}
        />
      ) : null}
    </main>
  )
}
