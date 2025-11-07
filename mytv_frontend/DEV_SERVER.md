# Dev server behavior

- Host: 0.0.0.0 by default (server.host: true) and honors `--host` CLI if provided; never written to disk.
- Port: 3000 is pinned with `strictPort: true` for both dev and preview. If 3000 is busy the process exits with a clear error (no silent port switching).
- HMR: overlay enabled; clientPort fixed to 3000 for reliable proxying behind orchestrators.
- Watch: polling disabled; awaitWriteFinish debounce enabled (stabilityThreshold: 900ms, pollInterval: 200ms).
- Ignored watch paths (prevent self-restart loops), including:
  - `**/dist/**`, `**/.git/**`, `**/*.md`, `**/DEV_SERVER.md`, `**/README.md`, `**/node_modules/**`, `**/.env*`
  - Lockfiles and scripts: `**/*.lock`, `**/package-lock.json`, `**/pnpm-lock.yaml`, `**/yarn.lock`, `**/scripts/**`
  - Critical configs: `**/vite.config.*`, `**/*eslint*.config.*`, and other `**/*.config.*`
  - CI churn: `**/post_process_status.lock`
- Scope: only `src`, `public`, and `index.html` are watched during dev (fs.strict + ignored paths).
- Readiness: GET /healthz returns 200 OK.
- Dev never serves `/dist/*`; a middleware explicitly 404s those paths.
- Preview mirrors dev host/port/allowedHosts and exposes /healthz.

Allowed hosts:
- vscode-internal-26938-beta.beta01.cloud.kavia.ai (configured for dev and preview)

Scripts:
- npm run dev            -> vite (port 3000 strict; if busy the process exits to reveal collision).
- npm run dev:port       -> sets PORT=3000 for environments that rely on env injection; still strict on 3000.
- npm run preview        -> vite preview (strict on 3000; fails if port is busy).
- npm run preview:port   -> sets PORT=3000 explicitly for preview.
- npm run build:tizen    -> builds to ./dist (no packaging)
- npm run package:tizen  -> creates app.wgt at project root without requiring system 'zip'
- npm run build-and-package:tizen -> build then package in one command

Quick checks:
- Verify readiness:
  curl -fsS http://127.0.0.1:${PORT:-3000}/healthz || echo "not ready"

- Run on explicit port 3000 (strict) in non-interactive mode:
  npm run dev -- --host 0.0.0.0 --port 3000

Operational notes:
- No runtime writes to `.env` or `vite.config.js`. No scripts/plugins in this repo modify these files.
- Watcher excludes `vite.config.js`, docs, and lockfiles; these changes will not trigger HMR restarts.
- Avoid adding middleware/plugins that write to files during requests; this causes watch loops.
- Do not add tools that auto-write to `dist/` during dev; builds should only output to `dist` when running `vite build`.
- If you observe reload loops: check for file churn in `dist/`, `.git/`, and ensure no process modifies `.env` or `vite.config.js`. Also verify CI is not updating lock/docs paths within watched scope.

## Second screen navigation

After Splash, the second screen (Home) renders a Top menu with four focusable buttons:
- Home, Login, Settings, and My Plan

Behavior:
- Home and Login navigate to /home and /login respectively.
- Settings and My Plan navigate to anchors on the Home page (/home#settings and /home#plan), with smooth scroll into view.
- Buttons are focusable and remote/keyboard accessible (Enter activates).

Validation checklist:
1) Start dev server:
   npm run dev -- --host 0.0.0.0 --port 3000
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
The packaging flow uses a Node-based zipper to create a valid .wgt, avoiding a system `zip` dependency.

Steps:
1. Run `npm run build:tizen` to produce `./dist`.
2. Run `npm run package:tizen` to generate `./app.wgt` that includes all files under `dist/` plus `config.xml` at the archive root.
