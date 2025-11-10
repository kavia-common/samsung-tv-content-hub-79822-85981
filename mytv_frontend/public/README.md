This public directory is intentionally minimal.

- Do NOT place .html files under public/assets or public/ directly.
- If you need to keep raw HTML exported from design tools, place them under:
  mytv_frontend/assets-reference/
These files are references only and should not be served by Vite to avoid dev-server reload storms.

Allowed:
- public/images/**
- public/assets/** but only CSS/JS/media (no .html)
