import { useEffect } from 'react'

/**
 PUBLIC_INTERFACE
 Home page that mounts the provided AAF_inicio Copy 2 design.
 - Uses assets/aafinicio-copy-2-2001-3396.css for pixel-perfect positioning and styles.
 - Renders markup adapted to JSX, preserving class names and ids so CSS applies exactly.
 - Safely initializes assets/aafinicio-copy-2-2001-3396.js after mount for keyboard/focus hooks.
 - Images (if any) should reference exact /assets/figmaimages/* paths; current screen has shape/vector placeholders only.
*/
export default function Home() {
  useEffect(() => {
    // Dynamically load and initialize the screen JS once on mount
    const script = document.createElement('script')
    script.src = '/assets/aafinicio-copy-2-2001-3396.js'
    script.async = true
    document.head.appendChild(script)
    return () => {
      // Cleanup: remove script to avoid duplicate listeners across HMR/page switches
      document.head.removeChild(script)
    }
  }, [])

  // Import CSS at runtime by adding a link to head to ensure specificity and avoid bundler CSS transformation side-effects
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/assets/aafinicio-copy-2-2001-3396.css'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // The following markup mirrors assets/aafinicio-copy-2-2001-3396.html body content.
  // Keep structure, ids, and classes so the CSS positions elements pixel-perfectly.
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div id="screen-aafinicio-2001-3396" className="figma-screen">
        {/* Header */}
        <div className="header" aria-label="Top Navigation" role="navigation">
          <div className="header-bg" />
          <div className="header-content">
            <div className="logo-claro-video" aria-hidden="true" />
            <div className="menu-items">
              <div className="menu-item active">Inicio</div>
              <div className="menu-item">Películas</div>
              <div className="menu-item">Series</div>
              <div className="menu-item">TV en vivo</div>
              <div className="menu-item">Kids</div>
              <div className="menu-item">Mis Contenidos</div>
            </div>
            <div className="search-avatar">
              <div className="search-icon" aria-label="Buscar" role="img" />
              <div className="avatar-focus" aria-hidden="true" />
              <div className="avatar" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Molecules/Highlights (hero strip) */}
        <div className="highlights" role="region" aria-label="Destacados">
          <div className="highlight highlight-a" aria-hidden="true">
            <div className="mask" />
            <div className="object">
              {/* If future raster provided, set via CSS background-image using /assets/figmaimages/... */}
              <div className="image" />
            </div>
          </div>
          <div className="highlight highlight-b">
            <div className="image" />
          </div>
          <div className="highlight highlight-c" aria-hidden="true">
            <div className="mask" />
            <div className="object">
              <div className="image" />
            </div>
          </div>
        </div>

        {/* Seguí viendo (Continue watching) */}
        <section className="continue-watching" aria-label="Seguí viendo">
          <h2 className="carousel-title">Seguí viendo</h2>

          {/* Card 1 */}
          <div className="cw-card">
            <div className="cw-card-media">
              <div className="cw-card-image" />
              <div className="cw-progress">
                <div className="cw-progress-track" />
                <div className="cw-progress-bar" />
              </div>
            </div>
            <div className="cw-card-footer">
              <div className="cw-card-footer-bg" />
              <div className="cw-title">Rogue One</div>
              <div className="cw-icon-delete" aria-hidden="true" />
              <div className="cw-dot-yellow" aria-hidden="true" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="cw-card">
            <div className="cw-card-media">
              <div className="cw-card-image" />
              <div className="cw-progress">
                <div className="cw-progress-track" />
                <div className="cw-progress-bar" />
              </div>
            </div>
            <div className="cw-card-footer">
              <div className="cw-card-footer-bg" />
              <div className="cw-title">Ex Machina</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="cw-card">
            <div className="cw-card-media">
              <div className="cw-card-image" />
              <div className="cw-progress">
                <div className="cw-progress-track" />
                <div className="cw-progress-bar" />
              </div>
            </div>
            <div className="cw-card-footer">
              <div className="cw-card-footer-bg" />
              <div className="cw-title">Sing Street</div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="cw-card">
            <div className="cw-card-media">
              <div className="cw-card-image" />
              <div className="cw-progress">
                <div className="cw-progress-track" />
                <div className="cw-progress-bar" />
              </div>
            </div>
            <div className="cw-card-footer">
              <div className="cw-card-footer-bg" />
              <div className="cw-title">2012</div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="cw-card">
            <div className="cw-card-media">
              <div className="cw-card-image" />
              <div className="cw-progress">
                <div className="cw-progress-track" />
                <div className="cw-progress-bar" />
              </div>
            </div>
            <div className="cw-card-footer">
              <div className="cw-card-footer-bg" />
              <div className="cw-title">Ad Astra</div>
            </div>
          </div>
        </section>

        {/* Canales de TV */}
        <section className="tv-channels" aria-label="Canales de TV">
          <div className="channels-title">Canales de TV</div>

          {/* Channel card 1 */}
          <div className="channel-card">
            <div className="channel-card-image" />
            <div className="channel-info">
              <div className="channel-brand">Marca Claro Radio</div>
              <div className="channel-number">004 | Claro sports</div>
              <div className="channel-time">11:30 - 12:30</div>
              <div className="channel-live-badge">EN VIVO</div>
              <div className="channel-play tv-play" role="button" aria-label="Reproducir en vivo" />
            </div>
            <div className="channel-progress">
              <div className="channel-progress-track" />
              <div className="channel-progress-bar" />
            </div>
            <div className="channel-tag-alquila" aria-label="Alquilá" />
          </div>

          {/* Channel card 2 */}
          <div className="channel-card">
            <div className="channel-card-image" />
            <div className="channel-info">
              <div className="channel-brand">E.T.</div>
              <div className="channel-number">005 | HBO Channel</div>
              <div className="channel-time">11:30 - 12:30</div>
              <div className="channel-live-badge">EN VIVO</div>
              <div className="channel-play tv-play" role="button" aria-label="Reproducir en vivo" />
            </div>
            <div className="channel-progress">
              <div className="channel-progress-track" />
              <div className="channel-progress-bar" />
            </div>
          </div>

          {/* Channel card 3 */}
          <div className="channel-card">
            <div className="channel-card-image" />
            <div className="channel-info">
              <div className="channel-brand">Marca Claro Radio</div>
              <div className="channel-number">004 | Claro sports</div>
              <div className="channel-time">11:30 - 12:30</div>
              <div className="channel-live-badge">EN VIVO</div>
              <div className="channel-play tv-play" role="button" aria-label="Reproducir en vivo" />
            </div>
            <div className="channel-progress">
              <div className="channel-progress-track" />
              <div className="channel-progress-bar" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
