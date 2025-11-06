# Dev server behavior

- Host: 0.0.0.0 (external access enabled)
- Port: from PORT or VITE_PORT env (default 3000)
- strictPort: true (Vite will NOT auto-pick a new port; it will fail if 3000 is taken)
- HMR: clientPort uses the server port; overlay enabled; host inferred (no forced 0.0.0.0)
- Watch: polling disabled; awaitWriteFinish debounce enabled; dist/ and .git ignored; only src, public, config considered
- Readiness: GET /healthz returns 200 OK (side-effect free)
- Dev does not serve or read from dist/; dist/ is only used for build output

Scripts:
- npm run dev            -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run dev:port       -> sets PORT=3000 explicitly
- npm run preview        -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run preview:port   -> sets PORT=3000 explicitly

Operational notes:
- Do NOT write to .env at runtime. No scripts/plugins in this repo modify .env.
- Avoid adding middleware or plugins that write to files on each request; this causes watch loops.
- Prefer configuring dev server entirely in vite.config.js (avoid duplicate CLI flags like --host/--port).
