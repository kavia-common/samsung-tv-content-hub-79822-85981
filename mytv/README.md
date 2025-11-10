# MyTV (React + Vite + Tailwind)

A small Netflix-like dark UI with Splash, Home, and Login pages. Uses React Router v6 and Tailwind CSS.

Routes:
- `/` Splash: centered title, fades in, auto-navigates to `/home` after ~3 seconds.
- `/home` Home: banner and six horizontal rails using local images.
- `/login` Login: email/password and a CTA, with link back to Home.

## Getting Started

1) Install deps:
   npm install

2) Run dev server (port controlled by CLI, strictPort=true):
   npm run dev
   # or
   npm run dev:3000

3) Build:
   npm run build

4) Preview build:
   npm run preview

## Tech
- React 19, React Router v6
- Vite 5
- TailwindCSS 3.4

## Tailwind
- Dark theme enabled via `html.dark` class in index.html.
- Extended palette: bg.*, surface.*, accent.red, brand.primary/secondary.
- Subtle transitions and hover animations included.

## Data abstraction
Local content is defined in `src/data/localContent.js`.
- TODO: Add `src/data/apiContent.js` to fetch from a mock backend and switch via a simple module alias or env guard.

## File Structure
- src/components: Splash, Home, Login, NavBar, Rail, Thumbnail
- src/data/localContent.js: seed items and banner
- tailwind.config.js, postcss.config.js: Tailwind setup
- public/images: local placeholder assets

No external API keys required.
