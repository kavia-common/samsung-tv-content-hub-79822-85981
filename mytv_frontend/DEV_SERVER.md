# Dev server behavior

- Host: 0.0.0.0 (external access enabled via `server.host: true`)
- Port: 3000 by default, but respects `PORT` env and `--port` CLI (single source in vite.config.js)
- strictPort: true (Vite will NOT auto-pick a new port; it will fail if the chosen port is taken)
- HMR: overlay enabled; host inferred by default (set `HMR_HOST` env only if needed behind proxies)
- Watch: polling disabled; awaitWriteFinish debounce enabled (stabilityThreshold: 900ms, pollInterval: 200ms)
- Ignored watch paths: `**/dist/**`, `**/.git/**`, `**/*.md`, `**/DEV_SERVER.md`, `**/node_modules/**`, `**/.env*`, lockfiles, scripts, `post_process_status.lock`
- Scope: only `src`, `public`, and `index.html` are intended for changes during dev (fs.strict + ignored paths)
- Readiness: GET /healthz returns 200 OK (side-effect free)
- Dev does not serve or read from `dist/`; `dist/` is only used for build output (middleware blocks `/dist/*` in dev)
- Host/Port are centralized in vite.config.js; avoid passing duplicate CLI flags such as `--host` and `--port` redundantly.

Allowed hosts:
- vscode-internal-26938-beta.beta01.cloud.kavia.ai (configured for dev and preview)

Scripts:
- npm run dev            -> uses vite.config.js (port 3000 or PORT/--port)
- npm run dev:port       -> sets PORT=3000 explicitly (optional)
- npm run preview        -> vite preview (same host/port rules as dev)
- npm run preview:port   -> sets PORT=3000 explicitly for preview (optional)
- npm run build:tizen    -> builds to ./dist (no packaging)
- npm run package:tizen  -> creates app.wgt at project root without requiring system 'zip'
- npm run build-and-package:tizen -> build then package in one command

Quick checks:
- Use curl to verify readiness:
  curl -fsS http://127.0.0.1:${PORT:-3000}/healthz || echo "not ready"
- Respect external host:
  npm run dev -- --port 3001
  npm run preview -- --port 3001
  # or:
  PORT=3001 npm run dev
  PORT=3001 npm run preview

Operational notes:
- Do NOT write to `.env` or `vite.config.js` at runtime. No scripts/plugins in this repo modify these files.
- Avoid adding middleware or plugins that write to files on each request; this causes watch loops.
- Prefer configuring dev server entirely in `vite.config.js` (avoid duplicate CLI flags like `--host`/`--port`).
- Do not add tools that auto-write to `dist/` during dev; builds should only output to `dist/` when running `vite build`.
- If you observe reload loops: check for file churn in `dist/`, `.git/`, and ensure no process modifies `.env` or `vite.config.js`. Also verify that CI or other agents are not updating `post_process_status.lock` or docs inside watched scopes.

## Tizen packaging (no external zip)
The packaging flow no longer uses the system `zip` CLI. Instead, a Node-based zipper writes a valid .wgt file:

Steps:
1. Run `npm run build:tizen` to produce `./dist`.
2. Run `npm run package:tizen` to generate `./app.wgt` that includes all files under `dist/` plus `config.xml` at the archive root.

This avoids errors like `zip: not found` in CI and local environments lacking `zip`.
