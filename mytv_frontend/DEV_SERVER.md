# Dev server behavior

- Host: 0.0.0.0 by default (server.host: true) AND honors `--host` CLI if provided; we never write host to disk.
- Port: 3000 by default, but respects `PORT` env and `--port` CLI (single source in vite.config.js). Example: run on 3001 with:
  - `npm run dev -- --host 0.0.0.0 --port 3001` or `PORT=3001 npm run dev`
- strictPort: true (Vite will NOT auto-pick a new port; it will fail if the chosen port is taken)
- HMR: overlay enabled; host inferred by default (set `HMR_HOST` env only if needed behind proxies)
- Watch: polling disabled; awaitWriteFinish debounce enabled (stabilityThreshold: 900ms, pollInterval: 200ms)
- Ignored watch paths (prevent self-restart loops), including but not limited to:
  - `**/dist/**`, `**/.git/**`, `**/*.md`, `**/DEV_SERVER.md`, `**/README.md`, `**/node_modules/**`, `**/.env*`
  - Lockfiles and scripts: `**/*.lock`, `**/package-lock.json`, `**/pnpm-lock.yaml`, `**/yarn.lock`, `**/scripts/**`
  - Critically: `**/vite.config.*`, `**/*eslint*.config.*`, and other `**/*.config.*`
  - CI churn: `**/post_process_status.lock`
- Scope: only `src`, `public`, and `index.html` are intended for changes during dev (fs.strict + ignored paths)
- Readiness: GET /healthz returns 200 OK (side-effect free)
- Dev does not serve or read from `dist/`; `dist/` is only used for build output (middleware blocks `/dist/*` in dev)
- Preview mirrors dev host/port/allowedHosts and exposes a /healthz endpoint via middleware so proxies can check readiness.
- Host/Port are honored from CLI/env without writing back to config or .env. No runtime writes occur.

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

- Run on default 3000 with strictPort:
  npm run dev -- --host 0.0.0.0 --port 3000

- Verify allowedHosts includes vscode-internal-26938-beta.beta01.cloud.kavia.ai (already configured).

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

Validation checklist:
1) Start dev server on port 3001:
   npm run dev -- --host 0.0.0.0 --port 3001
2) Open the app and wait for Splash to redirect (~5.5s) to /home.
3) Confirm top menu shows four buttons: Home, Login, Settings, My Plan.
4) Use keyboard/remote:
   - Left/Right moves focus between the four buttons.
   - Enter on Home -> stays on /home.
   - Enter on Login -> navigates to /login, inputs are focusable.
   - Enter on Settings -> navigates to /home#settings and scrolls the Settings section into view.
   - Enter on My Plan -> navigates to /home#plan and scrolls the section into view.
5) Confirm no dev server restart occurs when navigating or interacting with UI.

## Tizen packaging (no external zip)
The packaging flow no longer uses the system `zip` CLI. Instead, a Node-based zipper writes a valid .wgt file:

Steps:
1. Run `npm run build:tizen` to produce `./dist`.
2. Run `npm run package:tizen` to generate `./app.wgt` that includes all files under `dist/` plus `config.xml` at the archive root.

This avoids errors like `zip: not found` in CI and local environments lacking `zip`.
