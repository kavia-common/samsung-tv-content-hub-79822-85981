# Dev server behavior (stabilized)

- Root: Explicit absolute path to the mytv_frontend directory; only this app is watched.
- Host: 0.0.0.0 (server.host: true).
- Allowed host: vscode-internal-39544-beta.beta01.cloud.kavia.ai
- Port/HMR: Fixed HMR clientPort 3000; strictPort=true to avoid bouncing.

Watcher hardening:
- Polling disabled: `server.watch.usePolling = false`
- Debounce writes: `awaitWriteFinish.stabilityThreshold=350ms`
- Absolute ignores added (resolved at runtime):
  - This project’s vite.config.js (and its realpath if symlinked)
  - Workspace root directory
  - Sibling project `mytv/` and its vite config
  - Any `vite.config.js` in parent workspace
- Glob ignores:
  - `**/vite.config.*`, `**/postcss.config.*`, `**/tailwind.config.*`, `**/DEV_SERVER.md`
  - `.env` files: `**/.env`, `**/.env.*` (env changes do not restart dev server)
  - HTML under `public/assets` and `assets`: `**/public/assets/**/*.html`, `**/assets/**/*.html`
  - Build/cache/SCM: `**/node_modules/**`, `**/.git/**`, `**/dist/**`, `**/.vite/**`
  - Parents/siblings: `../**`, `../../**`, `../../../**`

Index/Assets:
- Ensure a single `index.html` exists at the project root (`mytv_frontend/index.html`) and it contains exactly one module script to `/src/main.jsx`.
- Do not place HTML files in `public/assets/`. Raw HTML design exports belong in `assets-reference/` only.

Environment variables:
- Use `.env.local` for local overrides. Watcher ignores `.env*`, so changes do not auto-restart. Never write to `.env*` from scripts.

Scripts/Tools:
- Dev scripts: `"dev": "vite"` (no hooks that modify files).
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

Verification checklist:
1) Start dev server:
   npm run dev -- --host 0.0.0.0 --port 3000
2) Confirm terminal shows Vite ready and no messages like:
   - "vite.config.js changed, restarting server..."
   - file change notices from ../ or ../../ paths
3) Edit a source file under src/ and observe HMR updates without full restarts.
4) Confirm Splash → Home (~5s) → Login navigation works without runtime errors.
5) Ensure no other `index.html` exists except at project root; none under public/assets.
6) Ensure no symlinked vite.config.js; if symlinked, its realpath is auto-ignored.
7) Ensure no tooling writes to vite.config.js or .env* during dev.

Notes:
- No script writes to vite.config.js, index.html, or any `.env*` during dev.
- If CI/memory constraints cause termination, use `npm run dev:mem:256` or `npm run dev:mem`.
