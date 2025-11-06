# Dev server behavior

- Host: 0.0.0.0 (external access enabled via `server.host: true`)
- Port: 3000 by default, but respects `PORT` env and `--port` CLI (single source in vite.config.js). Example: run on 3001 with:
  - `npm run dev -- --host 0.0.0.0 --port 3001` or `PORT=3001 npm run dev`
- strictPort: true (Vite will NOT auto-pick a new port; it will fail if the chosen port is taken)
- HMR: overlay enabled; host inferred by default (set `HMR_HOST` env only if needed behind proxies)
- Watch: polling disabled; awaitWriteFinish debounce enabled (stabilityThreshold: 900ms, pollInterval: 200ms)
- Ignored watch paths: `**/dist/**`, `**/.git/**`, `**/*.md`, `**/DEV_SERVER.md`, `**/README.md`, `**/node_modules/**`, `**/.env*`, lockfiles, scripts, `post_process_status.lock`, and critically `vite.config.*` and other `*.config.*` files to prevent self-restart loops. Changes to these files will not trigger HMR restarts.
- Scope: only `src`, `public`, and `index.html` are intended for changes during dev (fs.strict + ignored paths)
- Readiness: GET /healthz returns 200 OK (side-effect free)
- Dev does not serve or read from `dist/`; `dist/` is only used for build output (middleware blocks `/dist/*` in dev)
- Host/Port are centralized in vite.config.js; no runtime writes to config or .env occur.
- No scripts or plugins in this repository modify vite.config.js at runtime. Runtime edits are prohibited and ignored by the watcher.

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
- Verify readiness:
  curl -fsS http://127.0.0.1:${PORT:-3000}/healthz || echo "not ready"
- Run on preview env port 3001 (non-interactive, stable and will not self-restart):
  npm run dev -- --host 0.0.0.0 --port 3001
  # or:
  PORT=3001 npm run dev

Operational notes:
- Absolutely do NOT write to `.env` or `vite.config.js` at runtime. No scripts/plugins in this repo modify these files.
- The watcher excludes `vite.config.js`, `README.md`, `DEV_SERVER.md`, and other config/docs; changes to these files will not trigger HMR restarts.
- Avoid adding middleware/plugins that write to files during requests; this causes watch loops.
- Do not add tools that auto-write to `dist/` during dev; builds should only output to `dist` when running `vite build`.
- If you observe reload loops: check for file churn in `dist/`, `.git/`, and ensure no process modifies `.env` or `vite.config.js`. Also verify that CI or other agents are not updating `post_process_status.lock` or docs inside watched scopes.

## Second screen navigation

After Splash, the second screen (Home) renders a Top menu with four focusable buttons:
- Home, Login, Settings, and My Plan

Behavior:
- Home and Login navigate to /home and /login respectively.
- Settings and My Plan navigate to anchors on the Home page (/home#settings and /home#plan), with smooth scroll into view.
- Buttons are focusable and remote/keyboard accessible (Enter activates).

## Tizen packaging (no external zip)
The packaging flow no longer uses the system `zip` CLI. Instead, a Node-based zipper writes a valid .wgt file:

Steps:
1. Run `npm run build:tizen` to produce `./dist`.
2. Run `npm run package:tizen` to generate `./app.wgt` that includes all files under `dist/` plus `config.xml` at the archive root.

This avoids errors like `zip: not found` in CI and local environments lacking `zip`.
