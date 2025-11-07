# Dev server behavior

- Host: 0.0.0.0 by default (server.host: true) and honors HOST env/CLI if provided; never written to disk.
- Port: 3000 is pinned with strictPort: true for both dev and preview. If 3000 is busy the process exits with a clear error (no silent port switching).
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
- npm run dev            -> vite (port 3000 strict; relies on vite.config.js defaults).
- npm run dev:3000       -> sets PORT=3000 explicitly; still strict on 3000.
- npm run dev:mem        -> runs dev with NODE_OPTIONS=--max-old-space-size=384 to reduce memory spikes.
- npm run dev:mem:256    -> runs dev with NODE_OPTIONS=--max-old-space-size=256 for tighter limits.
- npm run preview        -> vite preview (strict on 3000; fails if port is busy).
- npm run build:tizen    -> builds to ./dist (no packaging)
- npm run package:tizen  -> creates app.wgt at project root without requiring system 'zip'
- npm run build-and-package:tizen -> build then package in one command

Notes:
- Duplicate CLI flags for --port/--host are intentionally avoided in scripts. Prefer PORT env if changing port.
- Avoid adding wrapper scripts that pass both PORT and --port/--host redundantly; this can confuse orchestrators.
- If port 3000 is busy, the process will exit (strictPort=true). Free the port or choose another explicitly (e.g., PORT=3001 npm run dev).
- The HMR clientPort is fixed to 3000 to match orchestrator proxy; do not override unless proxy port changes.

Quick checks:
- Verify readiness:
  curl -fsS http://127.0.0.1:${PORT:-3000}/healthz || echo "not ready"

- Run on explicit port 3000 (strict) in non-interactive mode:
  npm run dev:3000

Operational notes:
- No runtime writes to `.env` or `vite.config.js`. Defaults are set in the config; scripts avoid duplicate CLI flags.
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
1) Start dev server (strict 3000):
   npm run dev:3000
2) Open the app and wait for Splash to redirect (~5.5s) to /home.
3) Confirm top menu shows four buttons: Home, Login, Settings, My Plan.
4) Use keyboard/remote:
   - Left/Right moves focus between the four buttons.
   - Enter on Home -> stays on /home.
   - Enter on Login -> navigates to /login, inputs are focusable.
   - Enter on Settings -> navigates to /home#settings and scrolls the Settings section into view.
   - Enter on My Plan -> navigates to /home#plan and scrolls the section into view.
5) Confirm no dev server restart occurs when navigating or interacting with UI.

If the orchestrator kills the process due to memory limits (exit 137), prefer:
- npm run dev:mem:256
or
- npm run dev:mem
