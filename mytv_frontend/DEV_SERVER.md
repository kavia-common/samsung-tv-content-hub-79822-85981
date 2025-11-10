# Dev server behavior

- Host: 0.0.0.0 by default (server.host: true).
- Port: Controlled by CLI/env. `server.port` is undefined with `strictPort: false` so Vite can choose an available port if needed.
- HMR: overlay enabled; `clientPort` is derived from PORT/CLI when provided to match orchestrator proxying (defaults to 3000).

Watch:
- Polling disabled; `awaitWriteFinish` debounce enabled (stabilityThreshold: 900ms, pollInterval: 200ms).
- Ignored: `**/dist/**`, `**/.git/**`, `**/node_modules/**`, lockfiles, and `post_process_status.lock`.

Allowed hosts:
- vscode-internal-39544-beta.beta01.cloud.kavia.ai

Scripts:
- npm run dev            -> vite
- npm run dev:3000       -> vite --host 0.0.0.0 --port 3000
- npm run dev:mem        -> vite with NODE_OPTIONS=--max-old-space-size=384
- npm run dev:mem:256    -> vite with NODE_OPTIONS=--max-old-space-size=256
- npm run preview        -> vite preview
- npm run build:tizen    -> vite build
- npm run package:tizen  -> creates app.wgt at project root
- npm run build-and-package:tizen -> build then package in one command

Notes:
- Avoid adding middleware/plugins that terminate requests or write to disk during dev; none are required.
- Vite serves from the `mytv_frontend/` root only. Do not run preview/dev from the sibling `mytv/` project for this container.

Validation checklist:
1) Start dev server:
   npm run dev -- --host 0.0.0.0 --port 3000
   (or another available port)
2) Open the app and wait for Splash to redirect (~5s) to /home.
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
