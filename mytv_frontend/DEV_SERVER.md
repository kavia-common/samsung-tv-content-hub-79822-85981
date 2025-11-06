# Dev server behavior

- Host: 0.0.0.0 (external access enabled via `server.host: true`)
- Port: 3001 (centralized in vite.config.js; use `npm run dev:port` to explicitly set PORT=3001)
- strictPort: true (Vite will NOT auto-pick a new port; it will fail if 3000 is taken)
- HMR: overlay enabled; host inferred (do not set `hmr.host`)
- Watch: polling disabled; awaitWriteFinish debounce enabled (stabilityThreshold: 800ms, pollInterval: 150ms)
- Ignored watch paths: `**/dist/**`, `**/.git/**`, `**/*.md`, `**/DEV_SERVER.md`, `**/node_modules/**`, `**/vite.config.js`, `**/.env*`
- Scope: only `src`, `public`, and `index.html` are intended for changes during dev (fs.strict + ignored paths)
- Readiness: GET /healthz returns 200 OK (side-effect free)
- Dev does not serve or read from `dist/`; `dist/` is only used for build output (middleware blocks `/dist/*` in dev)
- Host/Port are centralized in vite.config.js; do not pass duplicate CLI flags such as `--host` / `--port`

Scripts:
- npm run dev            -> uses vite.config.js (port 3000)
- npm run dev:port       -> sets PORT=3000 explicitly (optional)
- npm run preview        -> preview on port 3000 per vite.config.js
- npm run preview:port   -> sets PORT=3000 explicitly for preview (optional)
- npm run build:tizen    -> builds to ./dist (no packaging)
- npm run package:tizen  -> creates app.wgt at project root without requiring system 'zip'
- npm run build-and-package:tizen -> build then package in one command

Operational notes:
- Do NOT write to `.env` or `vite.config.js` at runtime. No scripts/plugins in this repo modify these files.
- Avoid adding middleware or plugins that write to files on each request; this causes watch loops.
- Prefer configuring dev server entirely in `vite.config.js` (avoid duplicate CLI flags like `--host`/`--port`).
- Do not add tools that auto-write to `dist/` during dev; builds should only output to `dist/` when running `vite build`.
- If you observe reload loops: check for file churn in `dist/` or `.git/` and ensure no process modifies `.env` or `vite.config.js`.

## Tizen packaging (no external zip)
The packaging flow no longer uses the system `zip` CLI. Instead, a Node-based zipper writes a valid .wgt file:

Steps:
1. Run `npm run build:tizen` to produce `./dist`.
2. Run `npm run package:tizen` to generate `./app.wgt` that includes all files under `dist/` plus `config.xml` at the archive root.

This avoids errors like `zip: not found` in CI and local environments lacking `zip`.
