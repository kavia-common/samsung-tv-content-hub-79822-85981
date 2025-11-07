import { useMemo, useRef, useState, useEffect } from 'react'
import Banner from '../components/Banner.jsx'
import Rail from '../components/Rail.jsx'
import Subscriptions from '../components/Subscriptions.jsx'

/**
 PUBLIC_INTERFACE
 Home page with banner, top menu, multiple content rails, and subscriptions section.
 Local sample data uses images under /images.
 Includes anchor sections for Settings and My Plan to support hash navigation.
 Effects avoid infinite rerenders: rails are memoized; hash scroll runs once on mount.
*/
export default function Home() {
  const [currentRail, setCurrentRail] = useState(0)
  const scrollAreaRef = useRef(null)

  const mkItems = (prefix, count) =>
    Array.from({ length: count }).map((_, i) => ({
      id: `${prefix}-${i + 1}`,
      title: `${prefix} ${i + 1}`,
      image: `/images/thumb${(i % 12) + 1}.svg`,
    }))

  const rails = useMemo(
    () => {
      // Build default rails/items
      const base = [
        { title: 'Top Trending', items: mkItems('Trending', 14) },
        { title: 'Continue Watching', items: mkItems('Continue', 10) },
        { title: 'Action', items: mkItems('Action', 12) },
        { title: 'Drama', items: mkItems('Drama', 12) },
        { title: 'Horror', items: mkItems('Horror', 12) },
        { title: 'Comedy', items: mkItems('Comedy', 12) },
        { title: 'Documentary', items: mkItems('Documentary', 12) },
      ]

      // Minimal override: rename first trending item to "Gladiator" and set its image.
      // Use Vite public URL convention: /images/gladiator.jpg
      if (base[0]?.items?.length > 0) {
        base[0].items[0] = {
          ...base[0].items[0],
          title: 'Gladiator',
          image: '/images/gladiator.jpg',
        }
      }

      return base
    },
    [],
  )

  // If navigated with a hash (e.g., #settings, #plan), ensure we scroll into view on mount
  useEffect(() => {
    // Single-run on mount to handle deep link anchors (e.g., #settings, #plan)
    const raw = typeof window !== 'undefined' ? window.location.hash : ''
    const hash = raw ? raw.replace('#', '') : ''
    if (!hash) return
    const el = document.getElementById(hash)
    if (el && typeof el.scrollIntoView === 'function') {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' }), 60)
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%', overflow: 'hidden' }}>
        {/* Prominent page heading per Ocean Professional theme */}
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

        <Banner image="/images/banner.jpg" />
        <div ref={scrollAreaRef} style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
          {/* Content rails */}
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

          {/* Settings section anchor */}
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

          {/* My Plan section anchor */}
          <section id="plan" style={{ marginTop: 28, marginBottom: 16 }}>
            <div className="section-title">My Plan</div>
            <Subscriptions />
          </section>
        </div>
      </div>
    </div>
  )
}
