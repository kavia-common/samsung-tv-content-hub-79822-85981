# Dev server behavior

- Host: 0.0.0.0 (external access enabled)
- Port: from PORT or VITE_PORT env (default 3000)
- strictPort: true (Vite will NOT auto-pick a new port; it will fail if 3000 is taken)
- HMR: clientPort uses the server port; overlay enabled; host inferred (no forced 0.0.0.0)
- Watch: debounced writes enabled; polling disabled; dist/ excluded from watch to prevent reload storms
- Readiness: GET /healthz returns 200 OK (side-effect free)

Scripts:
- npm run dev            -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run dev:port       -> sets PORT=3000 explicitly
- npm run preview        -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run preview:port   -> sets PORT=3000 explicitly
