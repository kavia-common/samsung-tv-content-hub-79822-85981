///////////////////////////////////////////////////////////////
// PUBLIC_INTERFACE
// movies.js
// Data service for Home rails and banner, integrating with
// https://5bc9cfc0.api.kavia.app/ with graceful local fallback.
//
// Exposes:
// - fetchMovies(): fetches from API, normalizes { id, name, poster, genre }, and returns grouped rails
// - fetchHomeData(): alias that delegates to fetchMovies() for backwards-compat
// - fetchTrending(): returns Top Trending (subset) with fallback
 // - mapApiToItem(): maps API item to normalized shape { id, name, poster, genre }
// - getBanner(): returns a featured banner candidate
//
// Behavior:
// - Network first: tries the mock API; on error, falls back to local inline placeholders.
// - Grouped rails: Top Trending, Continue Watching, Action, Drama, Horror, Other Genres (+ remaining).
// - No environment variables are used; API base is fixed per request.
///////////////////////////////////////////////////////////////

const API_BASE = 'https://5bc9cfc0.api.kavia.app';

/**
 * Normalize API genres to an array of strings.
 */
function normGenres(rawGenres) {
  if (!rawGenres) return [];
  if (Array.isArray(rawGenres)) return rawGenres.map(String);
  if (typeof rawGenres === 'string') {
    const parts = rawGenres.split(/[,|/]/g).map(s => s.trim()).filter(Boolean);
    return parts.length ? parts : [rawGenres.trim()];
  }
  return [];
}

// PUBLIC_INTERFACE
export function mapApiToItem(raw = {}, idx = 0) {
  /**
   * Map API item into UI item with exact keys: { id, name, poster, genre }.
   * Accept common alternates to populate 'name' and 'poster', but the returned object uses lowercase keys.
   */
  const id =
    raw.id ??
    raw._id ??
    raw.slug ??
    `api-${idx}-${String(raw.name || raw.title || 'unknown').toLowerCase().replace(/\s+/g, '-')}`;

  const name = raw.name ?? raw.title ?? 'Untitled';

  // poster must be lowercase; accept alternates but output 'poster'
  const poster =
    raw.poster ??
    raw.Poster ??
    raw.image ??
    raw.thumbnail ??
    '';

  const genres = normGenres(raw.genres ?? raw.genre ?? raw.category);
  const genre = genres[0] || 'Other Genres';

  return { id, name, poster, genre };
}

async function tryFetchJson(url, opts) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchMovies() {
  /**
   * Fetches from mock API and returns grouped rails:
   * [{ title: 'Top Trending', items }, { title: 'Continue Watching', items }, 'Action', 'Drama', 'Horror', 'Other Genres', ...]
   * Falls back to local placeholders on error.
   * Items are normalized to { id, name, poster, genre }.
   */
  try {
    const data = await tryFetchJson(`${API_BASE}/`);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.items)
      ? data.items
      : [];

    const mapped = list.map(mapApiToItem);
    const groups = groupBy(mapped, (x) => x.genre || 'Other Genres');

    // Rails: trending first 12, continue watching next 8, then preferred genre order, then rest alphabetically.
    const trending = mapped.slice(0, 12);
    const continueWatching = mapped.slice(12, 20);

    const preferredOrder = ['Action', 'Drama', 'Horror', 'Other Genres'];
    const genreNames = Object.keys(groups);

    const sortedGenres = [
      ...preferredOrder.filter((g) => genreNames.includes(g)),
      ...genreNames
        .filter((g) => !preferredOrder.includes(g))
        .sort((a, b) => a.localeCompare(b)),
    ];

    const genreRails = sortedGenres.map((g) => ({
      title: g,
      items: groups[g] || [],
    }));

    return [
      { title: 'Top Trending', items: trending },
      { title: 'Continue Watching', items: continueWatching },
      ...genreRails,
    ];
  } catch {
    // Fallback to local rails
    return localHomeRails();
  }
}

// PUBLIC_INTERFACE
export async function fetchHomeData() {
  /** Alias to fetchMovies() to keep existing imports working. */
  return fetchMovies();
}

// PUBLIC_INTERFACE
export async function fetchTrending() {
  /** Return trending list; local fallback. */
  try {
    const rails = await fetchMovies();
    const top = rails.find((r) => r?.title === 'Top Trending');
    if (top?.items?.length) return top.items;
  } catch {
    // ignore and fallback
  }
  const local = buildLocalItems();
  return local.slice(0, 12);
}

/**
 * PUBLIC_INTERFACE
 */
export async function getBanner() {
  /**
   * Return banner candidate for the hero area.
   * Uses normalized fields; falls back to inline data URL if missing.
   */
  try {
    const rails = await fetchMovies();
    const firstRail = rails?.[0];
    const firstItem = firstRail?.items?.[0];
    if (firstItem) {
      return {
        id: firstItem.id,
        title: firstItem.name,
        backdrop: firstItem.poster || dataBanner(),
        subtitle: 'Handpicked selection for you.',
      };
    }
  } catch {
    // ignore and use local
  }

  const items = buildLocalItems();
  const first = items[0] || {
    id: 'banner-1',
    name: 'Welcome to MyTV',
    poster: dataBanner(),
    genre: 'Action',
  };
  return {
    id: first.id,
    title: first.name,
    backdrop: first.poster || dataBanner(),
    subtitle: 'Experience the calm power of the deep.',
  };
}

// Helpers

function groupBy(arr, keyGetter) {
  return arr.reduce((acc, item) => {
    const key = keyGetter(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function dataThumb(label = '') {
  const bg = '#1f2937'; // slate-800
  const fg = '#e5e7eb'; // gray-200
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="150">`
    + `<rect width="100%" height="100%" fill="${bg}"/>`
    + `<text x="12" y="84" fill="${fg}" font-family="Arial" font-size="16" font-weight="700">${String(label).slice(0,18)}</text>`
    + `</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function dataBanner() {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="360">`
    + `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">`
    + `<stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#0b1220"/>`
    + `</linearGradient></defs>`
    + `<rect width="100%" height="100%" fill="url(#g)"/>`
    + `<text x="48" y="220" fill="#ffffff" font-family="Arial" font-weight="900" font-size="64">Ocean Professional</text>`
    + `</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function localHomeRails() {
  const items = buildLocalItems();
  const groups = groupBy(items, (x) => x.genre);
  const trending = items.slice(0, 12);
  const continueWatching = items.slice(12, 16);

  const sections = [
    { title: 'Top Trending', items: trending },
    { title: 'Continue Watching', items: continueWatching },
  ];

  const preferredOrder = ['Action', 'Drama', 'Horror', 'Comedy', 'Other Genres'];
  const byName = Object.keys(groups).sort((a, b) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  for (const g of byName) {
    sections.push({ title: g, items: groups[g] });
  }
  return sections;
}

function buildLocalItems() {
  // Local placeholder catalog rendered with inline SVG data URLs to avoid filesystem dependencies.
  const genres = {
    Action: [
      { t: 'Gladiator II' },
      { t: 'Skyfall' },
      { t: 'Mad Max' },
      { t: 'Atomic Blonde' },
      { t: 'John Wick' },
      { t: 'The Raid' },
    ],
    Drama: [
      { t: 'The Revenant' },
      { t: 'Moonlight' },
      { t: 'Whiplash' },
      { t: 'Parasite' },
      { t: 'Nomadland' },
      { t: 'The Father' },
    ],
    Horror: [
      { t: 'Hereditary' },
      { t: 'It Follows' },
      { t: 'The Witch' },
      { t: 'A Quiet Place' },
      { t: 'Get Out' },
      { t: 'Us' },
    ],
    Comedy: [
      { t: 'The Nice Guys' },
      { t: 'Palm Springs' },
      { t: 'Game Night' },
      { t: 'Superbad' },
      { t: '21 Jump Street' },
      { t: 'Free Guy' },
    ],
    'Other Genres': [
      { t: 'Free Solo' },
      { t: 'Planet Earth' },
      { t: "Chef's Table" },
      { t: 'Drive to Survive' },
      { t: 'Abstract' },
      { t: 'Explained' },
    ],
  };

  const out = [];
  let c = 0;
  for (const [genre, arr] of Object.entries(genres)) {
    for (const { t } of arr) {
      const poster = dataThumb(t);
      out.push({
        id: `local-${c++}`,
        name: t,
        poster,
        genre,
      });
    }
  }
  return out;
}
