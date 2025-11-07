import { useEffect } from 'react'

/**
 * PUBLIC_INTERFACE
 * Home page that mounts the provided AAF_inicio Copy 2 design.
 * - Uses /assets/aafinicio-copy-2-2001-3396.css for pixel-accurate styles.
 * - Renders JSX adapted from the original HTML while preserving ids/classes so CSS applies exactly.
 * - Initializes key handling for .tv-play nodes scoped to this screen with cleanup on unmount.
 * - Images (if later provided) must reference exact /assets/figmaimages/* paths from YAML.
 */
export default function Home() {
  // Ensure the Figma-derived CSS is present for this page lifecycle.
  useEffect(() => {
    const attr = 'aafinicio-copy-2-2001-3396'
    let link = document.querySelector('link[data-figma-css="aafinicio-copy-2-2001-3396"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/assets/aafinicio-copy-2-2001-3396.css'
      link.dataset.figmaCss = attr
      document.head.appendChild(link)
    }
    return () => {
      // Remove only what we added to avoid touching any global style with same dataset
      const node = document.querySelector('link[data-figma-css="aafinicio-copy-2-2001-3396"]')
      if (node?.parentNode) node.parentNode.removeChild(node)
    }
  }, [])

  // Initialize minimal behavior for potential .tv-play elements; no network fetch required.
  useEffect(() => {
    const root = document.getElementById('screen-aafinicio-2001-3396')
    if (!root) return

    const added = []
    const nodes = root.querySelectorAll('.tv-play')
    nodes.forEach((btn) => {
      btn.setAttribute('tabindex', '0')
      const onKey = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          btn.click()
          e.preventDefault()
        }
      }
      btn.addEventListener('keydown', onKey)
      added.push({ btn, onKey })
    })

    return () => {
      added.forEach(({ btn, onKey }) => {
        try { btn.removeEventListener('keydown', onKey) } catch {}
      })
    }
  }, [])

  // Markup adapted from assets/aafinicio-copy-2-2001-3396.html, preserving structure and classes.
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
          {/* Claro video logo placeholder */}
          <div className="logo placeholder-icon" aria-hidden="true" />
        </header>

        {/* Highlights strip */}
        <section id="highlights" className="highlights" aria-label="Destacados">
          {/* Highlight A */}
          <div className="a-mask-left" aria-hidden="true" />
          <div className="a-object" aria-hidden="true" />

          {/* Highlight B */}
          <div className="b">
            {/* Note: No provided figmaimages; keep placeholder */}
            <div className="image" aria-hidden="true" />
          </div>

          {/* Highlight C */}
          <div className="c-mask-right" aria-hidden="true" />
          <div className="c-object" aria-hidden="true" />
        </section>

        {/* Seguí viendo */}
        <section id="segui-viendo" className="seg-section" aria-label="Seguí viendo">
          <h2 className="seg-title text-typo-157">Seguí viendo</h2>

          {/* Card 1 */}
          <article className="seg-card1" aria-label="Rogue One">
            <div className="img" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="name-bg" aria-hidden="true" />
            <div className="name-title text-typo-167">Rogue One</div>
          </article>
          {/* Delete + yellow dot */}
          <div className="seg-delete placeholder-icon" aria-hidden="true" title="delete" />
          <div className="seg-yellow-dot" aria-hidden="true" title="yellow" />

          {/* Card 2 */}
          <article className="seg-card2" aria-label="Ex Machina">
            <div className="img" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="name-bg" aria-hidden="true" />
            <div className="name-title text-typo-167">Ex Machina</div>
          </article>

          {/* Card 3 */}
          <article className="seg-card3" aria-label="Sing Street">
            <div className="img" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="name-bg" aria-hidden="true" />
            <div className="name-title text-typo-167">Sing Street</div>
          </article>

          {/* Card 4 */}
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

          {/* Card A */}
          <article className="tv-card1" aria-label="Marca Claro Radio, 004 | Claro sports, 11:30 - 12:30">
            <div className="poster" aria-hidden="true" />
            <div className="play-circle" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="live-badge"><span className="badge-text text-typo-160">EN VIVO</span></div>
            <div className="text-typo-158" style={{ position: 'absolute' }}>Marca Claro Radio</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>004 | Claro sports</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>11:30 - 12:30</div>
          </article>

          {/* Card B */}
          <article className="tv-card2" aria-label="E.T., 005 | HBO Channel, 11:30 - 12:30">
            <div className="poster-a" aria-hidden="true" />
            <div className="poster-b" aria-hidden="true" />
            <div className="play-circle" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="live-badge"><span className="badge-text text-typo-160">EN VIVO</span></div>
            <div className="text-typo-158" style={{ position: 'absolute' }}>E.T.</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>005 | HBO Channel</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>11:30 - 12:30</div>
          </article>

          {/* Card C */}
          <article className="tv-card3" aria-label="Marca Claro Radio, 004 | Claro sports, 11:30 - 12:30">
            <div className="poster" aria-hidden="true" />
            <div className="play-circle" aria-hidden="true" />
            <div className="pbar-bg" aria-hidden="true" />
            <div className="pbar-fill" aria-hidden="true" />
            <div className="live-badge"><span className="badge-text text-typo-160">EN VIVO</span></div>
            <div className="text-typo-158" style={{ position: 'absolute' }}>Marca Claro Radio</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>004 | Claro sports</div>
            <div className="text-typo-159" style={{ position: 'absolute' }}>11:30 - 12:30</div>
          </article>

          {/* Tag Alquilá */}
          <div className="tag-alquila" aria-label="Alquilá">
            <div className="badge-text text-typo-160" style={{ position: 'absolute', left: 10, top: 6 }}>Alquilá</div>
          </div>
        </section>
      </div>
    </div>
  )
}
