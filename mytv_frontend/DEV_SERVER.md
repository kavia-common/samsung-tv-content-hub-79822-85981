# Dev server behavior (minimal Vite v4)

- Host: 0.0.0.0 (server.host=true). Nothing writes to disk.
- Port: Controlled by CLI/env. server.port is undefined with strictPort: true so orchestrator --port (e.g., 3000) is authoritative. If the chosen port is busy the process exits with a clear error (no silent port switching).
- HMR: configured for proxy with secure WebSocket:
  - server.hmr = { host: 'vscode-internal-19531-beta.beta01.cloud.kavia.ai', clientPort: 443, protocol: 'wss' }.
- Watch: polling disabled. Non-source files and parent workspace directories are ignored to avoid reload loops.
- Scope: index.html, public, and src are served; fs.strict is disabled to safely serve project files while denying /dist during dev.
- Readiness: GET /healthz returns 200 OK. Also: GET /api/healthz returns {"status":"ok"}.
- Preview mirrors dev host behavior and exposes /healthz; port also controlled by CLI with strictPort.
- No custom lifecycle hooks: no keepalive timers, no server.close interception, and no port guards beyond strictPort.

Ignored watch paths (prevent self-restart loops):
- dist, .git, node_modules, *.md (including DEV_SERVER.md, README.md), .env*, lockfiles, post_process_status.lock
- assets-reference/**/*.html, public/assets/**/*.html
- Parent workspace dirs: ../../**, ../../../**

Allowed proxy host (for HMR):
- vscode-internal-19531-beta.beta01.cloud.kavia.ai

Scripts:
- npm run dev            -> vite (uses CLI/env to choose port; server.host is set in vite.config; strictPort=true).
- npm run dev:3000       -> vite --port 3000
- npm run dev:mem        -> NODE_OPTIONS=--max-old-space-size=384 vite
- npm run dev:mem:256    -> NODE_OPTIONS=--max-old-space-size=256 vite
- npm run dev:ci         -> vite
- npm run preview        -> vite preview
- npm run build:tizen    -> vite build
- npm run package:tizen  -> creates app.wgt at project root without requiring system 'zip'
- npm run build-and-package:tizen -> build then package

Quick checks:
- Verify readiness:
  curl -fsS http://127.0.0.1:${PORT:-3000}/healthz || echo "not ready"
- Verify readiness (json):
  curl -fsS http://127.0.0.1:${PORT:-3000}/api/healthz || echo "not ready"

Troubleshooting:
- If you see "Port 3000 is already in use" when starting, it means another instance (orchestrator-run) is already bound. Use the health probe above to confirm readiness or choose another port:
  npm run dev -- --port 3001
- If /healthz returns 404 from a foreign process, ensure you are hitting the Vite instance in this repo (our Vite adds /healthz in both dev and preview).

Validation checklist:
1) Start dev server via orchestrator (injects --host/--port) or run:
   npm run dev -- --host 0.0.0.0 --port 3000
2) Probe health:
   curl -fsS http://127.0.0.1:${PORT:-3000}/healthz
   curl -fsS http://127.0.0.1:${PORT:-3000}/api/healthz
3) Ensure the process remains running (no exit code 1/143) and responds to probes continually.
4) UI: Splash redirects to /home after ~3s; Top menu provides Home, Login, Settings, My Plan navigation.
