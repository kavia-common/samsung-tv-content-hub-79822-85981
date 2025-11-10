Public assets policy:

- Serve only immutable static assets from here.
- Do NOT place raw HTML files in this folder; extra HTML can trigger Vite reloads.
- Place runtime assets under:
  - public/images/**   (images only)
  - public/assets/**   (CSS/JS only)
- Health check file reserved: public/healthz (ignored by watcher).

Note: .env and .env.* are ignored by Vite watcher; change requires manual restart if needed.
