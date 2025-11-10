# Dev server behavior

- Host: 0.0.0.0 by default (server.host: true).
- Port: Controlled by CLI/env. `strictPort: false` lets Vite choose an available port if 3000 is busy.
- HMR: overlay enabled; `clientPort` derives from PORT or defaults to 3000.

Watch:
- Custom ignore rules to prevent reload storms:
  - Ignored: dist, node_modules, .git, lock/log files, post_process_status.lock
  - Ignored: public/**/* except whitelisted `public/images/**` and `public/assets/**`
  - Ignored: public/healthz and subpaths
- Keep assets under `public/assets/` or `public/images/` only. Do not programmatically write to `public/` or `index.html` at runtime.

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
- index.html contains a single #root and a single module script to /src/main.jsx. No meta-refresh, no auto reload scripts.
- All design CSS/JS used by pages live under `/public/assets/*`. Avoid placing raw HTML design exports inside public/.

Validation checklist:
1) Start dev server:
   npm run dev -- --host 0.0.0.0 --port 3000
2) Splash renders and auto-navigates to /home (≈5s).
3) Top menu shows: Home, Login, Settings, My Plan; keys and Enter navigate and scroll to anchors.
4) Terminal shows initial Vite ready message; no repeated "page reload" logs in a loop after idle.
5) HMR updates work without full reload loops.

If the orchestrator kills the process due to memory limits (exit 137), prefer:
- npm run dev:mem:256
or
- npm run dev:mem
