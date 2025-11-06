import { useMemo, useState } from 'react'
import Banner from '../components/Banner.jsx'
import Rail from '../components/Rail.jsx'
import Subscriptions from '../components/Subscriptions.jsx'

/**
 PUBLIC_INTERFACE
 Home page with banner, top menu, multiple content rails, and subscriptions section.
 Local sample data uses images under /images.
*/
export default function Home() {
  const [currentRail, setCurrentRail] = useState(0)

  const mkItems = (prefix, count) =>
    Array.from({ length: count }).map((_, i) => ({
      id: `${prefix}-${i + 1}`,
      title: `${prefix} ${i + 1}`,
      image: `/images/thumb${(i % 12) + 1}.jpg`,
    }))

  const rails = useMemo(
    () => [
      { title: 'Top Trending', items: mkItems('Trending', 14) },
      { title: 'Continue Watching', items: mkItems('Continue', 10) },
      { title: 'Action', items: mkItems('Action', 12) },
      { title: 'Drama', items: mkItems('Drama', 12) },
      { title: 'Horror', items: mkItems('Horror', 12) },
      { title: 'Comedy', items: mkItems('Comedy', 12) },
      { title: 'Documentary', items: mkItems('Documentary', 12) },
    ],
    [],
  )

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%', overflow: 'hidden' }}>
        <Banner image="/images/banner.jpg" />
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
          {rails.map((r, idx) => (
            <Rail
              key={r.title}
              title={r.title}
              items={r.items}
              railIndex={idx}
              currentRail={currentRail}
              setCurrentRail={setCurrentRail}
            />
          ))}
          <Subscriptions />
        </div>
      </div>
    </div>
  )
}
