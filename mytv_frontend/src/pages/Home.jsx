import React, { useEffect, useMemo, useState } from 'react'
import Banner from '../components/Banner.jsx'
import Rail from '../components/Rail.jsx'
import Subscriptions from '../components/Subscriptions.jsx'
import ShowDetails from '../components/ShowDetails.jsx'
import { fetchHomeData, getBanner } from '../services/movies.js'

/**
 * PUBLIC_INTERFACE
 * Home page: Top banner, multiple rails populated by local images, and subscriptions at bottom.
 * - Uses keyboard-friendly rails with focusable thumbnail cards.
 * - Local placeholders from /public/images are used now; service prepared for API.
 */
export default function Home() {
  const [currentRail, setCurrentRail] = useState(0)
  const [details, setDetails] = useState(null)
  const [rails, setRails] = useState([])
  const [banner, setBanner] = useState({ backdrop: '/images/banners/banner1.jpg', title: 'Welcome to MyTV', subtitle: 'Enjoy your favorites' })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [r, b] = await Promise.all([fetchHomeData(), getBanner()])
        if (!cancelled) {
          setRails(r || [])
          setBanner(b || banner)
        }
      } catch {
        // keep defaults on error
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
        onWatch={() => setDetails({ id: banner.id || 'banner', title: banner.title, description: 'Featured selection', poster: banner.backdrop })}
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
          onOpenDetails={(it) => setDetails({ ...it, description: 'Local demo item' })}
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
