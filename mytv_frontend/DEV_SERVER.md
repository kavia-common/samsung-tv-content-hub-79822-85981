# Dev server behavior

- Host: 0.0.0.0 (external access enabled)
- Preferred port: from PORT or VITE_PORT env (default 3000)
- strictPort: false (Vite will pick next available, e.g., 3001)
- Readiness: GET /healthz returns 200 OK

Scripts:
- npm run dev            -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run dev:port       -> sets PORT=3000 explicitly
- npm run preview        -> uses ENV PORT or VITE_PORT if provided (defaults to 3000)
- npm run preview:port   -> sets PORT=3000 explicitly
