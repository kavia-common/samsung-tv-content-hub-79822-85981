# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses Babel (or oxc via rolldown-vite) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses SWC for Fast Refresh

## Dev server and health check

- Dev server runs on 0.0.0.0 with strictPort=false; the port is controlled by CLI/env (e.g., `--port 3000` or `--port 3005`). Use `npm run dev` or `npm run dev:3000`.
- A readiness endpoint is served by Vite at `/` and the app also logs a dev heartbeat; no custom middleware is required.
- Allowed hosts configured: vscode-internal-39544-beta.beta01.cloud.kavia.ai

Stability notes:
- No runtime process writes to vite.config.js or .env. Defaults are set in the config; scripts avoid duplicate CLI flags.
- Watcher ignores only dist/.git/node_modules and lockfiles to avoid reload storms without skipping source updates.

Commands:
- npm run dev -> vite (port controlled by CLI/env)
- npm run dev:3000 -> vite --port 3000
- npm run dev:mem -> dev with reduced memory cap (NODE_OPTIONS=--max-old-space-size=384)
- npm run dev:mem:256 -> dev with tighter memory cap (256 MB)
- npm run preview -> vite preview (port controlled by CLI/env)

Tip: To run on a specific port non-interactively (e.g., 3001 or 3005), use:
- npm run dev -- --host 0.0.0.0 --port 3001
- npm run dev -- --host 0.0.0.0 --port 3005

Project root:
- Use only `mytv_frontend/` as the Vite root for this app. The sibling `mytv/` project is a separate demo and is not used by preview for this container.

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
