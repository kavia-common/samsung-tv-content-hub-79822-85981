# Asset HTML references (not served by Vite)

This folder holds raw exported HTML files from design tools. They are references only.

Why here?
- Placing `*.html` under `public/` or `assets/` can cause Vite dev server to treat them as served content and can trigger watch/HMR reload loops when they change.
- Our app imports only the paired CSS/JS (for styling/behaviors) as static assets. The React pages render JSX that mirrors those structures, so the raw HTML files are not needed at runtime.

Notes:
- Do not move these files back into `public/` or `src`. If you need to reference their structure, open them here.
- CSS/JS consumed at runtime remain in `/public/assets/*.css|*.js` so React pages can link them safely.

Files parked here:
- aafinicio-copy-2-2001-3396.html
- 35-4077-14472.html
