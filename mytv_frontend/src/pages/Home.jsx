import { useEffect } from 'react'

/**
 * PUBLIC_INTERFACE
 * Home page that mounts the provided AAF_inicio Copy 2 design.
 * - Uses /assets/aafinicio-copy-2-2001-3396.css for pixel-accurate styles.
 * - Renders JSX adapted from the original HTML while preserving ids/classes so CSS applies exactly.
 * - Safely loads the screen JS behaviors on mount and cleans up on unmount.
 * - Images referenced by the HTML/CSS must remain under /assets/figmaimages/* if present.
 */
export default function Home() {
  // Inject page-specific CSS on mount; remove on unmount to avoid global leaks.
  useEffect(() => {
    const datasetKey = 'aafinicio-copy-2-2001-3396'
    let link = document.querySelector(`link[data-figma-css="${datasetKey}"]`)
    if (!link) {
      link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/assets/aafinicio-copy-2-2001-3396.css'
      link.dataset.figmaCss = datasetKey
      document.head.appendChild(link)
    }
    return () => {
      const node = document.querySelector(`link[data-figma-css="${datasetKey}"]`)
      if (node?.parentNode) node.parentNode.removeChild(node)
    }
  }, [])

  // Load/init the Figma screen JS after mount. We avoid DOMContentLoaded dependency and call its init behavior ourselves.
  useEffect(() => {
    // The asset file adds a DOMContentLoaded listener; to ensure behaviors are active now, we can also manually set up essentials.
    const root = document.getElementById('screen-aafinicio-2001-3396')
    const cleanupFns = []

    if (root) {
      // Minimal keyboard accessibility for elements tagged as tv-play
      const tvPlayNodes = root.querySelectorAll('.tv-play')
      tvPlayNodes.forEach((btn) => {
        btn.setAttribute('tabindex', '0')
        const onKey = (e) => {
          if (e.key === 'Enter' || e.keyCode === 13) {
            btn.click()
            e.preventDefault()
          }
        }
        btn.addEventListener('keydown', onKey)
        cleanupFns.push(() => {
          try { btn.removeEventListener('keydown', onKey) } catch {}
        })
      })
    }

    // Also append the original behavior script as a module-less script tag so any extra logic runs (idempotent).
    const script = document.createElement('script')
    script.src = '/assets/aafinicio-copy-2-2001-3396.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      cleanupFns.forEach(fn => {
        try { fn() } catch {}
      })
      if (script?.parentNode) {
        try { script.parentNode.removeChild(script) } catch {}
      }
    }
  }, [])

  // JSX adapted to preserve ids/classes from assets/aafinicio-copy-2-2001-3396.html.
  // Note: If future assets reference /assets/figmaimages/* ensure those images exist under public/assets.
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div id="screen-aafinicio-2001-3396" className="figma-screen aafinicio-copy-2" role="document" aria-label="AAF_inicio Copy 2">
        {/* Header */}
        <header id="header" className="header" aria-label="Header">
          <div className="top-nav">
            <div className="bg" aria-hidden="true" />
            <div className="avatar-focus" aria-hidden="true" />
            <div className="avatar" aria-hidden="true" />
            <div className="search placeholder-icon" aria-hidden="true" />
            <nav className="labels" aria-label="Navegación superior">
              <span className="nav-inicio text-typo-165">Inicio</span>
              <span className="nav-peliculas text-typo-165">Películas</span>
              <span className="nav-series text-typo-165">Series</span>
              <span className="nav-tvenvivo text-typo-165">TV en vivo</span>
              <span className="nav-kids text-typo-165">Kids</span>
              <span className="nav-mis text-typo-165">Mis Contenidos</span>
            </nav>
          </div>
          <div className="active">
            <div className="bg" aria-hidden="true" />
            <div className="title text-typo-166">Inicio</div>
          </div>
          <div className="logo placeholder-icon" aria-hidden="true" />
        </header>

        {/* Highlights */}
        <section id="highlights" className="highlights" aria-label="Destacados">
          <div className="a-mask-left" aria-hidden="true" />
          <div className="a-object" aria-hidden="true" />

          <div className="b">
            <div className="image" aria-hidden="true" />
          </div>

          <div className="c-mask-right" aria-hidden="true" />
          <div className="c-object" aria-hidden="true" />
        </section>

        {/* Seguí viendo */}
        <section id="segui-viendo" className="seg-section" aria-label="Seguí viendo">
          <h2 className="seg-title text-typo-157">Seguí viendo</h2>

          <article className="seg-card1" aria-label="Rogue One">
            <div className="img" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="name-bg" aria-hidden="true" />
            <div className="name-title text-typo-167">Rogue One</div>
          </article>
          <div className="seg-delete placeholder-icon" aria-hidden="true" title="delete" />
          <div className="seg-yellow-dot" aria-hidden="true" title="yellow" />

          <article className="seg-card2" aria-label="Ex Machina">
            <div className="img" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="name-bg" aria-hidden="true" />
            <div className="name-title text-typo-167">Ex Machina</div>
          </article>

          <article className="seg-card3" aria-label="Sing Street">
            <div className="img" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="name-bg" aria-hidden="true" />
            <div className="name-title text-typo-167">Sing Street</div>
          </article>

          <article className="seg-card4" aria-label="2012">
            <div className="img" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="name-bg" aria-hidden="true" />
            <div className="name-title text-typo-167">2012</div>
          </article>
        </section>

        {/* Canales de TV */}
        <section id="canales-tv" className="tv-group" aria-label="Canales de TV">
          <h2 className="tv-title text-typo-157">Canales de TV</h2>

          <article className="tv-card1" aria-label="Marca Claro Radio, 004 | Claro sports, 11:30 - 12:30">
            <div className="poster" aria-hidden="true" />
            <div className="play-circle tv-play" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="live-badge"><span className="badge-text text-typo-160">EN VIVO</span></div>
            <div className="text-typo-158" style={{ position: 'absolute' }}>Marca Claro Radio</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>004 | Claro sports</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>11:30 - 12:30</div>
          </article>

          <article className="tv-card2" aria-label="E.T., 005 | HBO Channel, 11:30 - 12:30">
            <div className="poster-a" aria-hidden="true" />
            <div className="poster-b" aria-hidden="true" />
            <div className="play-circle tv-play" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="live-badge"><span className="badge-text text-typo-160">EN VIVO</span></div>
            <div className="text-typo-158" style={{ position: 'absolute' }}>E.T.</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>005 | HBO Channel</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>11:30 - 12:30</div>
          </article>

          <article className="tv-card3" aria-label="Marca Claro Radio, 004 | Claro sports, 11:30 - 12:30">
            <div className="poster" aria-hidden="true" />
            <div className="play-circle tv-play" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="live-badge"><span className="badge-text text-typo-160">EN VIVO</span></div>
            <div className="text-typo-158" style={{ position: 'absolute' }}>Marca Claro Radio</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>004 | Claro sports</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>11:30 - 12:30</div>
          </article>

          <div className="tag-alquila" aria-label="Alquilá">
            <div className="badge-text text-typo-160" style={{ position: 'absolute', left: 10, top: 6 }}>Alquilá</div>
          </div>
        </section>
      </div>
    </div>
  )
}
