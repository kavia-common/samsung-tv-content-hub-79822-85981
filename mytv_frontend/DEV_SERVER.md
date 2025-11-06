# Dev server behavior

- Host: 0.0.0.0 (external access enabled via `server.host: true`)
- Port: from PORT or VITE_PORT env (default 3000)
- strictPort: true (Vite will NOT auto-pick a new port; it will fail if 3000 is taken)
- HMR: minimal; `clientPort` uses the server port; overlay enabled; host inferred (do not set `hmr.host`)
- Watch: polling disabled; awaitWriteFinish debounce enabled; ignored: `**/dist/**`, `**/.git/**`, `**/node_modules/**`
- Scope: only `src`, `public`, and config files are intended for changes during dev (fs.strict + ignored paths)
- Readiness: GET /healthz returns 200 OK (side-effect free)
- Dev does not serve or read from dist/; dist/ is only used for build output (middleware blocks /dist/* in dev)
- Host/Port are centralized in vite.config.js; do not pass duplicate CLI flags such as `--host` / `--port`.

Scripts:
- npm run dev            -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run dev:port       -> sets PORT=3000 explicitly
- npm run preview        -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run preview:port   -> sets PORT=3000 explicitly

Operational notes:
- Do NOT write to .env at runtime. No scripts/plugins in this repo modify .env.
- Avoid adding middleware or plugins that write to files on each request; this causes watch loops.
- Prefer configuring dev server entirely in vite.config.js (avoid duplicate CLI flags like --host/--port).
- Do not add tools that auto-write to `dist/` during dev; builds should only output to `dist/` when running `vite build`.
- If you observe reload loops: check for any file churn in `dist/` or `.git/` and ensure no process modifies `.env`.
