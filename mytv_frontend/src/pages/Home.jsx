import React, { useMemo, useState } from 'react'
import Banner from '../components/Banner.jsx'
import Rail from '../components/Rail.jsx'
import Subscriptions from '../components/Subscriptions.jsx'
import ShowDetails from '../components/ShowDetails.jsx'

/**
 * PUBLIC_INTERFACE
 * Home page: Top banner, multiple rails populated by local images, and subscriptions at bottom.
 * - Uses keyboard-friendly rails with focusable thumbnail cards.
 * - Local assets under src/assets are used for banner and thumbnails.
 */
export default function Home() {
  const [currentRail, setCurrentRail] = useState(0)
  const [details, setDetails] = useState(null)

  // Build local demo items
  const thumbs = [
    { id: 't1', title: 'Blue Horizon', image: '/src/assets/thumbs/thumb1.svg' },
    { id: 't2', title: 'Amber Sky', image: '/src/assets/thumbs/thumb2.svg' },
    { id: 't3', title: 'Deep Sea', image: '/src/assets/thumbs/thumb3.svg' },
    { id: 't4', title: 'Ocean Route', image: '/src/assets/thumbs/thumb1.svg' },
    { id: 't5', title: 'Wave Runner', image: '/src/assets/thumbs/thumb2.svg' },
    { id: 't6', title: 'Silent Reef', image: '/src/assets/thumbs/thumb3.svg' },
  ]
  const rails = useMemo(() => ([
    { title: 'Top Trending', items: thumbs },
    { title: 'Continue Watching', items: thumbs.slice().reverse() },
    { title: 'Action', items: thumbs },
    { title: 'Drama', items: thumbs.slice(0, 5) },
    { title: 'Horror', items: thumbs },
    { title: 'Comedy', items: thumbs.slice(1) },
  ]), [])

  return (
    <main className="app-main" aria-label="Home">
      <Banner
        image="/src/assets/banners/hero-ocean.svg"
        title="The Ocean Within"
        subtitle="Experience the calm power of the deep."
        onWatch={() => setDetails({ id: 'banner', title: 'The Ocean Within', description: 'Demo banner item', poster: '/src/assets/thumbs/thumb1.svg' })}
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

      {/* Subscriptions */}
      <Subscriptions />

      {details ? (
        <ShowDetails
          id={details.id}
          onClose={() => setDetails(null)}
        />
      ) : null}
    </main>
  )
}
