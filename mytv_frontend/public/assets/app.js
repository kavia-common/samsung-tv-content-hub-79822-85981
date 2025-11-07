(function () {
  // Basic focus styles for .panel-btn for demo purposes
  function setupPanelButtons() {
    const buttons = document.querySelectorAll('.panel-btn');
    buttons.forEach((btn, idx) => {
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('focus', () => {
        btn.querySelector('.btn-tile')?.classList.add('focused');
      });
      btn.addEventListener('blur', () => {
        btn.querySelector('.btn-tile')?.classList.remove('focused');
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          const next = buttons[idx + 1];
          if (next) next.focus();
        } else if (e.key === 'ArrowLeft') {
          const prev = buttons[idx - 1];
          if (prev) prev.focus();
        } else if (e.key === 'Enter') {
          // Placeholder action
          console.log('Activated button', idx + 1);
          btn.classList.add('active');
          setTimeout(() => btn.classList.remove('active'), 200);
        }
      });
    });
  }

  function injectDemoStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .btn-tile.focused { outline: 2px solid #fff; box-shadow: 0 0 0 3px rgba(255,255,255,0.25); }
      .panel-btn.active .btn-tile { transform: scale(0.98); transition: transform 120ms ease; }
    `;
    document.head.appendChild(style);
  }

  window.addEventListener('DOMContentLoaded', () => {
    setupPanelButtons();
    injectDemoStyles();
  });
})();
