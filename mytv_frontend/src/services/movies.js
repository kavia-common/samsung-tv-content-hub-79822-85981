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

// PUBLIC_INTERFACE
export async function getBanner() {
  /** Return banner candidate for the hero area. */
  const items = buildLocalItems();
  const first = items[0] || {
    id: 'banner-1',
    title: 'Welcome to MyTV',
    image: '/images/banners/banner1.jpg',
    genre: 'Action',
  };
  return {
    ...first,
    backdrop: '/images/banners/banner1.jpg',
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
  // Local placeholder catalog (title on hover is supported by Thumbnail component)
  // Images expected under public/images/thumbs/*.jpg and grouped by genre.
  const genres = {
    Action: [
      { t: 'Gladiator II', f: 'action1.jpg' },
      { t: 'Skyfall', f: 'action2.jpg' },
      { t: 'Mad Max', f: 'action3.jpg' },
      { t: 'Atomic Blonde', f: 'action4.jpg' },
      { t: 'John Wick', f: 'action5.jpg' },
      { t: 'The Raid', f: 'action6.jpg' },
    ],
    Drama: [
      { t: 'The Revenant', f: 'drama1.jpg' },
      { t: 'Moonlight', f: 'drama2.jpg' },
      { t: 'Whiplash', f: 'drama3.jpg' },
      { t: 'Parasite', f: 'drama4.jpg' },
      { t: 'Nomadland', f: 'drama5.jpg' },
      { t: 'The Father', f: 'drama6.jpg' },
    ],
    Horror: [
      { t: 'Hereditary', f: 'horror1.jpg' },
      { t: 'It Follows', f: 'horror2.jpg' },
      { t: 'The Witch', f: 'horror3.jpg' },
      { t: 'A Quiet Place', f: 'horror4.jpg' },
      { t: 'Get Out', f: 'horror5.jpg' },
      { t: 'Us', f: 'horror6.jpg' },
    ],
    Comedy: [
      { t: 'The Nice Guys', f: 'comedy1.jpg' },
      { t: 'Palm Springs', f: 'comedy2.jpg' },
      { t: 'Game Night', f: 'comedy3.jpg' },
      { t: 'Superbad', f: 'comedy4.jpg' },
      { t: '21 Jump Street', f: 'comedy5.jpg' },
      { t: 'Free Guy', f: 'comedy6.jpg' },
    ],
    'Other Genres': [
      { t: 'Free Solo', f: 'other1.jpg' },
      { t: 'Planet Earth', f: 'other2.jpg' },
      { t: 'Chef\'s Table', f: 'other3.jpg' },
      { t: 'Drive to Survive', f: 'other4.jpg' },
      { t: 'Abstract', f: 'other5.jpg' },
      { t: 'Explained', f: 'other6.jpg' },
    ],
  };

  const out = [];
  let c = 0;
  for (const [genre, arr] of Object.entries(genres)) {
    for (const { t, f } of arr) {
      out.push({
        id: `local-${c++}`,
        title: t,
        image: `/images/thumbs/${f}`,
        genre,
      });
    }
  }
  return out;
}
