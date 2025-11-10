# Dev server behavior

- Host: 0.0.0.0 by default (server.host: true).
- Port: Controlled by CLI/env. `strictPort: false` lets Vite choose an available port if 3000 is busy.
- HMR: overlay enabled; `clientPort` derives from PORT or defaults to 3000.

Watch:
- Default Vite watcher; no custom middleware or FS settings.
- Keep assets under `public/` to avoid reload storms from files outside the project root.

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
- Do not include additional <script> or <link> tags to files outside `public/` or `src/` in index.html.
- All design CSS/JS used by pages live under `public/assets/`.

Validation checklist:
1) Start dev server:
   npm run dev -- --host 0.0.0.0 --port 3000
2) Splash renders and auto-navigates to /home (≈5s).
3) Top menu shows: Home, Login, Settings, My Plan; keys and Enter navigate and scroll to anchors.
4) No dev server restarts during navigation; HMR updates run without full reload loops.

If the orchestrator kills the process due to memory limits (exit 137), prefer:
- npm run dev:mem:256
or
- npm run dev:mem
