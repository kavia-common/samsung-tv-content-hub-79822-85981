(function () {
  'use strict';

  // PUBLIC_INTERFACE
  /**
   * Minimal interaction layer for screen 35.
   * - Adds focus ring handling to panel buttons.
   * - Provides basic keyboard navigation placeholders (Left/Right/Enter).
   * - Future extension hooks for remote key events can be added here.
   */
  function initFocusables() {
    const focusables = document.querySelectorAll('#screen-35-4077-14472 .panel-btn');
    focusables.forEach((el, idx) => {
      el.setAttribute('tabindex', '0');
      const tile = el.querySelector('.btn-tile');
      el.addEventListener('focus', () => {
        tile?.classList.add('focused');
      });
      el.addEventListener('blur', () => {
        tile?.classList.remove('focused');
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          const next = focusables[idx + 1];
          next?.focus();
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          const prev = focusables[idx - 1];
          prev?.focus();
          e.preventDefault();
        } else if (e.key === 'Enter') {
          // Placeholder activation feedback
          el.classList.add('active');
          setTimeout(() => el.classList.remove('active'), 160);
          e.preventDefault();
        }
      });
    });
  }

  function injectRuntimeStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #screen-35-4077-14472 .btn-tile.focused {
        outline: 2px solid rgba(255,255,255,0.95);
        box-shadow: 0 0 0 3px rgba(255,255,255,0.25);
      }
      #screen-35-4077-14472 .panel-btn.active .btn-tile {
        transform: scale(0.98);
        transition: transform 120ms ease;
      }
    `;
    document.head.appendChild(style);
  }

  window.addEventListener('DOMContentLoaded', () => {
    injectRuntimeStyles();
    initFocusables();
  });
})();
