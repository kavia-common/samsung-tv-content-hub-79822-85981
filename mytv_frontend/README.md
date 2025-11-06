# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Dev server and health check

- Dev server runs on 0.0.0.0 with strictPort=true; default port 3000 but respects PORT env or --port via vite.config.js.
- File watching is debounced and ignores non-source paths to avoid restart loops.
- Dist is not served during dev; outDir is only used for builds.
- A readiness endpoint is available at GET /healthz returning 200 OK.
- Allowed host configured: vscode-internal-26938-beta.beta01.cloud.kavia.ai
- See DEV_SERVER.md for full behavior and scripts.

Commands:
- npm run dev -> vite (uses vite.config.js)
- npm run preview -> vite preview (uses vite.config.js)

Tip: To run on a specific port non-interactively, do either:
- npm run dev -- --port 3001
- PORT=3001 npm run dev

## Second screen navigation

After Splash, the second screen (Home) renders a Top menu with four focusable buttons:
- Home, Login, Settings, and My Plan

Behavior:
- Home and Login navigate to /home and /login respectively.
- Settings and My Plan navigate to anchors on the Home page (/home#settings and /home#plan), with smooth scroll into view.
- Buttons are focusable and remote/keyboard accessible (Enter activates).

Dev server stability notes:
- The dev server ignores changes to vite.config.js and other config/docs to prevent HMR restart loops.
- To run on the preview env host/port without conflict: `npm run dev -- --host 0.0.0.0 --port 3001` (or `PORT=3001 npm run dev`).
- Allowed host includes vscode-internal-26938-beta.beta01.cloud.kavia.ai and strictPort=true ensures we don't auto-switch ports.

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

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
