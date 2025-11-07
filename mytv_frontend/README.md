# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses Babel (or oxc via rolldown-vite) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses SWC for Fast Refresh

## Dev server and health check

- Dev server runs on 0.0.0.0 with strictPort=true; port is pinned to 3000 for orchestrator. Use `npm run dev:3000` or `npm run dev -- --host 0.0.0.0 --port 3000`.
- File watching is debounced and ignores non-source paths to avoid restart loops. Notably, `vite.config.js`, `README.md`, `DEV_SERVER.md`, and other `*.config.*` files are excluded from watch to prevent HMR self-restarts.
- Dev never serves `/dist/*`; build output is only used for preview/build. A middleware 404s `/dist/*` during dev.
- A readiness endpoint is available at GET /healthz returning 200 OK.
- Allowed host configured: vscode-internal-26938-beta.beta01.cloud.kavia.ai
- See DEV_SERVER.md for full behavior and scripts.

Stability notes:
- No runtime process writes to vite.config.js or .env. CLI flags (--host/--port) are respected in-memory only.
- Vite watch ignores vite.config.js and docs/config/lockfiles to prevent HMR restart loops.
- Strict port (no auto port switching). If 3000 is reserved, run explicitly on another port via CLI, e.g., `--port 3001`.
- Quick readiness check: curl -fsS http://127.0.0.1:${PORT:-3000}/healthz || echo "not ready"

Commands:
- npm run dev -> vite (uses vite.config.js on port 3000 strict)
- npm run preview -> vite preview (uses vite.config.js on port 3000 strict)

Tip: To run on a specific port non-interactively (e.g., 3001), do either:
- npm run dev -- --host 0.0.0.0 --port 3001
- PORT=3001 npm run dev

Stability guarantees:
- The dev server ignores changes to `vite.config.js`, docs, and other config files to prevent HMR restart loops.
- No script or plugin in this repo modifies `vite.config.js` or `.env` at runtime. CLI flags `--host` and `--port` are honored in-memory only; nothing is written to disk.
- Allowed host includes vscode-internal-26938-beta.beta01.cloud.kavia.ai and strictPort=true ensures we don't auto-switch ports.

## Second screen navigation

After Splash, the second screen (Home) renders a Top menu with four focusable buttons:
- Home, Login, Settings, and My Plan

Behavior:
- Home and Login navigate to /home and /login respectively.
- Settings and My Plan navigate to anchors on the Home page (/home#settings and /home#plan), with smooth scroll into view.
- Buttons are focusable and remote/keyboard accessible (Enter activates).
- Navigation works without causing render loops; effects are carefully scoped.

## Tizen packaging

No external `zip` command is required.

- Build: `npm run build:tizen`
- Package: `npm run package:tizen` (generates `./app.wgt` at project root and includes `config.xml` at the root of the archive alongside all `dist/**` files)
- Combined: `npm run build-and-package:tizen`

Quick usage:
```
npm install
npm run build
npm run package:tizen
# outputs ./app.wgt
```

Notes:
- The packager does not rely on a system `zip` binary; it uses a Node-based zipper.
- Ensure `config.xml` exists at the project root: `mytv_frontend/config.xml`.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and `typescript-eslint` in your project.
