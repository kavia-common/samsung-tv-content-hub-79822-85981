(function () {
  'use strict';
  // PUBLIC_INTERFACE
  /**
   * Minimal initializer for AAF_inicio Copy 2 screen.
   * Keeps a hook for potential focus handling or dynamic injections.
   * Safe to run multiple times; idempotent on listeners.
   */
  function init() {
    try {
      const root = document.getElementById('screen-aafinicio-2001-3396');
      if (!root) return;
      // Example: make tv-play buttons keyboard accessible
      root.querySelectorAll('.tv-play').forEach(btn => {
        if (!btn.getAttribute('tabindex')) {
          btn.setAttribute('tabindex', '0');
        }
        // Avoid duplicate listener using a marker
        const mark = '__tv_play_init__';
        if (btn[mark]) return;
        const onKey = (e) => {
          if (e.key === 'Enter' || e.keyCode === 13) {
            try { btn.click(); } catch {}
            e.preventDefault();
          }
        };
        btn.addEventListener('keydown', onKey);
        btn[mark] = true;
      });
    } catch (e) {
      // Non-fatal: do not crash app if asset init fails
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[aafinicio-init] failed:', e?.message || e);
      }
    }
  }

  // Initialize on DOMContentLoaded; also run immediately if DOM is already ready.
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();
