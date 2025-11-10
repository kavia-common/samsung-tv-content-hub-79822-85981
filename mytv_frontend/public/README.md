This directory is served statically by Vite. To avoid reload storms:
- Do not programmatically write files here during dev.
- Only place static assets under:
  - public/images/** (watched)
  - public/assets/** (watched)
Health check files like public/healthz are ignored by the watcher and should not be mutated by the app.
