# Dev server behavior (stabilized)

- Root: Explicit absolute path to the mytv_frontend directory; only this app is watched.
- Host: 0.0.0.0 (server.host: true).
- Allowed host: vscode-internal-39544-beta.beta01.cloud.kavia.ai
- Port/HMR: Fixed HMR clientPort 3000; strictPort=true to avoid bouncing.

Watch ignores (strict):
- This config and sibling configs: `**/vite.config.*`, `**/postcss.config.*`, `**/tailwind.config.*`, `**/DEV_SERVER.md`
- Absolute ignores: project vite.config.js, workspace root, and sibling `mytv/` (and its vite.config.js).
- Sibling and workspace parents: `../**`, `../../**`, `../../../**` (prevents picking up `mytv/` or workspace `assets/`).
- HTML under public/assets and assets: `**/public/assets/**/*.html`, `**/assets/**/*.html`
- Environment files: `**/.env`, `**/.env.*` (env changes won’t restart; use `.env.local` and restart manually if needed)
- Build/cache/SCM: `**/node_modules/**`, `**/.git/**`, `**/dist/**`, `**/.vite/**`

Index/Assets:
- Ensure a single `index.html` exists at the project root (`mytv_frontend/index.html`).
- Do not place HTML files in `public/assets/`. Raw HTML design exports belong in `assets-reference/` only.

Environment variables:
- Use `.env.local` for local overrides. Watcher ignores `.env*`, so changes do not auto-restart. Never write to `.env*` from scripts.

Scripts/Tools:
- No postinstall/dev hooks or format-on-save modify `vite.config.js` during dev. `lint-staged` is disabled to avoid write-backs.

Commands:
- npm run dev            -> vite
- npm run dev:3000       -> vite --host 0.0.0.0 --port 3000
- npm run dev:mem        -> vite with NODE_OPTIONS=--max-old-space-size=384
- npm run dev:mem:256    -> vite with NODE_OPTIONS=--max-old-space-size=256
- npm run preview        -> vite preview
- npm run build:tizen    -> vite build
- npm run package:tizen  -> creates app.wgt at project root
- npm run build-and-package:tizen -> build then package in one command

Validation checklist:
1) Start dev server:
   npm run dev -- --host 0.0.0.0 --port 3000
2) Splash renders and auto-navigates to /home (~5s).
3) Top menu routes: Home → /home, Login → /login, anchors for Settings/My Plan.
4) Terminal shows Vite ready; no repeated reload/restart loops (no "vite.config.js changed, restarting server..." spam).
5) HMR updates work without full reloads or exits.

Notes:
- No script writes to vite.config.js, index.html, or any `.env*` during dev.
- If CI/memory constraints cause termination, use `npm run dev:mem:256` or `npm run dev:mem`.
