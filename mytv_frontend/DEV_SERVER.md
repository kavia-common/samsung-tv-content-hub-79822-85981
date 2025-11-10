# Dev server behavior

- Host: 0.0.0.0 by default (server.host=true resolves to 0.0.0.0) and honors HOST env/CLI if provided; never written to disk.
- Port: Controlled by CLI/env. server.port is undefined with strictPort: true so orchestrator --port (e.g., 3000 or 3005) is authoritative. If the chosen port is busy the process exits with a clear error (no silent port switching).
- HMR: overlay enabled; clientPort is derived from PORT/CLI when provided to match orchestrator proxying.
- Watch: polling disabled; awaitWriteFinish debounce enabled (stabilityThreshold: 900ms, pollInterval: 200ms).
- Ignored watch paths (prevent self-restart loops), including:
  - `**/dist/**`, `**/.git/**`, `**/*.md`, `**/DEV_SERVER.md`, `**/README.md`, `**/node_modules/**`, `**/.env*`
  - Lockfiles and scripts: `**/*.lock`, `**/package-lock.json`, `**/pnpm-lock.yaml`, `**/yarn.lock`, `**/scripts/**`
  - Critical configs: `**/vite.config.*`, `**/*eslint*.config.*`, and other `**/*.config.*`
  - CI churn: `**/post_process_status.lock`
  - Raw design HTML: `**/public/assets/**/*.html`, `**/assets/**/*.html`, `**/assets-reference/**/*.html` (prevents HMR reload storms)
  - Note: Raw exported HTML belongs in `assets-reference/` only. Do not place `*.html` under `public/assets` or `src/assets` as it can trigger needless reloads. Preview mode inherits the same ignore rules for stability.
- Scope: only `src`, `public`, and `index.html` are watched during dev (fs.strict + ignored paths).
- Readiness: GET /healthz returns 200 OK.
- Dev never serves `/dist/*`; a middleware explicitly 404s those paths.
- Preview mirrors dev host/allowedHosts and exposes /healthz via configurePreviewServer; port also controlled by CLI with strictPort.

Allowed hosts:
- vscode-internal-26938-beta.beta01.cloud.kavia.ai
- vscode-internal-33763-beta.beta01.cloud.kavia.ai
- vscode-internal-10832-beta.beta01.cloud.kavia.ai
- vscode-internal-28347-beta.beta01.cloud.kavia.ai

Scripts:
- npm run dev            -> vite (uses CLI/env to choose port; server.host is set in vite.config; strictPort=true).
- npm run dev:3000       -> runs vite with --port 3000; strictPort=true.
- npm run dev:mem        -> runs dev with NODE_OPTIONS=--max-old-space-size=384 to reduce memory spikes.
- npm run dev:mem:256    -> runs dev with NODE_OPTIONS=--max-old-space-size=256 for tighter limits.
- npm run preview        -> vite preview (port controlled by CLI; strictPort=true).
- npm run build:tizen    -> builds to ./dist (no packaging)
- npm run package:tizen  -> creates app.wgt at project root without requiring system 'zip'
- npm run build-and-package:tizen -> build then package in one command

Notes:
- Duplicate CLI flags for --port/--host are intentionally avoided in scripts. The orchestrator-provided flags take precedence.
- Avoid adding wrapper scripts that set both PORT and --port/--host redundantly; this can confuse orchestrators.
- If the requested port is busy, the process will exit (strictPort=true). Free the port or choose another explicitly (e.g., vite --port 3001).
- The HMR clientPort is derived from PORT/CLI when provided to match the proxy; do not hardcode unless your proxy requires it.

Quick checks:
- Verify readiness:
  curl -fsS http://127.0.0.1:${PORT:-3000}/healthz || echo "not ready"

Troubleshooting:
- If you see "Port 3000 is already in use" when starting, it means another instance (orchestrator-run) is already bound. Use the health probe above to confirm readiness or choose another port:
  npm run dev -- --port 3001
- If /healthz returns 404 from a foreign process, ensure you are hitting the Vite instance configured in this repo (our Vite adds /healthz in both dev and preview).

- Run on explicit port 3000 (strict) in non-interactive mode:
  npm run dev:3000

- Run on orchestrator-provided port 3005 (or other):
  npm run dev -- --port 3005

Operational notes:
- No runtime writes to `.env` or `vite.config.js`. Defaults are set in the config; scripts avoid duplicate CLI flags.
- Watcher excludes `vite.config.js`, docs, and lockfiles; these changes will not trigger HMR restarts.
- Strict port (no auto port switching). If desired port is reserved, run explicitly on another port via CLI (e.g., `--port 3001`).
- Avoid adding middleware/plugins that write to files during requests; this causes watch loops.
- Do not add tools that auto-write to `dist/` during dev; builds should only output to `dist` when running `vite build`.

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
   or
   npm run dev -- --host 0.0.0.0 --port 3005
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
