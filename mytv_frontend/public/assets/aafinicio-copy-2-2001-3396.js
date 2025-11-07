(function () {
  'use strict';
  // PUBLIC_INTERFACE
  /**
   * Minimal initializer for AAF_inicio Copy 2 screen.
   * Keeps a hook for potential focus handling or dynamic injections.
   */
  function init() {
    const root = document.getElementById('screen-aafinicio-2001-3396');
    if (!root) return;
    // Example: make tv-play buttons keyboard accessible
    root.querySelectorAll('.tv-play').forEach(btn => {
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          btn.click();
          e.preventDefault();
        }
      });
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
