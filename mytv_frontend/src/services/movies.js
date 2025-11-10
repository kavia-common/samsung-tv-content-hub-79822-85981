///////////////////////////////////////////////////////////////
// PUBLIC_INTERFACE
// movies.js
// Lightweight service prepared for future integration with
// https://5bc9cfc0.api.kavia.app/
//
// Exposes:
// - fetchHomeData(): returns grouped rails by genre with title and items
// - fetchTrending(): returns a flat trending list
// - mapApiToItem(): maps API { name, image, genre } to UI { id, title, image, genre }
// - getBanner(): returns a featured banner candidate
//
// Behavior:
// - Attempts to fetch remote data (disabled by default with shouldTryNetwork=false).
// - Falls back to local placeholder images from /public/images.
// - Groups by genre and produces Netflix-like rails.
// - Designed to be swapped to remote by setting shouldTryNetwork=true later.
///////////////////////////////////////////////////////////////

const API_BASE = 'https://5bc9cfc0.api.kavia.app';

// PUBLIC_INTERFACE
export function mapApiToItem(raw = {}, idx = 0) {
  /** Map API item { name, image, genre } into UI item { id, title, image, genre } */
  return {
    id: raw.id ?? raw._id ?? `api-${idx}-${(raw.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`,
    title: raw.name ?? raw.title ?? 'Untitled',
    image: raw.image ?? raw.thumbnail ?? '',
    genre: raw.genre ?? 'Other',
  };
}

async function tryFetchJson(url, opts) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchHomeData() {
  /**
   * Return rails shaped for Home:
   * [{ title: 'Top Trending', items: [...] }, { title: 'Action', items: [...] }, ...]
   * Local placeholders are used when network is disabled or fails.
   */
  const shouldTryNetwork = false; // flip to true when wiring the real API
  if (shouldTryNetwork) {
    try {
      const data = await tryFetchJson(`${API_BASE}/movies`);
      // Expecting array of { name, image, genre }
      const mapped = Array.isArray(data) ? data.map(mapApiToItem) : [];
      const groups = groupBy(mapped, (x) => x.genre || 'Other');
      // Prepare sections: Trending, Continue Watching (first few), then genres
      const trending = mapped.slice(0, 12);
      const continueWatching = mapped.slice(12, 20);
      const genreRails = Object.keys(groups).sort().map((g) => ({
        title: g,
        items: groups[g],
      }));
      return [
        { title: 'Top Trending', items: trending },
        { title: 'Continue Watching', items: continueWatching },
        ...genreRails,
      ];
    } catch {
      // fallthrough to local
    }
  }
  return localHomeRails();
}

// PUBLIC_INTERFACE
export async function fetchTrending() {
  /** Return trending list; local fallback. */
  const shouldTryNetwork = false;
  if (shouldTryNetwork) {
    try {
      const data = await tryFetchJson(`${API_BASE}/trending`);
      return Array.isArray(data) ? data.map(mapApiToItem) : [];
    } catch {
      // ignore and fallback
    }
  }
  const local = buildLocalItems();
  return local.slice(0, 12);
}

/**
 * PUBLIC_INTERFACE
 */
export async function getBanner() {
  /** Return banner candidate for the hero area. Uses inline data URL image to avoid missing files. */
  const items = buildLocalItems();
  const first = items[0] || {
    id: 'banner-1',
    title: 'Welcome to MyTV',
    image: dataBanner(),
    genre: 'Action',
  };
  return {
    ...first,
    backdrop: dataBanner(),
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
      out.push({
        id: `local-${c++}`,
        title: t,
        image: dataThumb(t),
        genre,
      });
    }
  }
  return out;
}
