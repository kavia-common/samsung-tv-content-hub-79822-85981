/**
 * PUBLIC_INTERFACE
 * fetchJSON
 * Fetch helper that throws a structured error on non-OK responses and returns parsed JSON.
 */
export async function fetchJSON(path, options = {}) {
  /** Fetches JSON from a relative API path and throws an Error with status and body on failure. */
  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    throw new Error('fetchJSON expects a same-origin relative path starting with "/"');
  }
  const res = await fetch(path, { headers: { Accept: 'application/json' }, ...options });
  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      try {
        body = await res.text();
      } catch {
        body = '';
      }
    }
    const err = new Error(`Request failed ${res.status} for ${path}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * getFeatured
 * Returns data for the featured banner from /api/featured
 */
export async function getFeatured() {
  /** Calls /api/featured and returns the first featured item or null on empty. */
  const data = await fetchJSON('/api/featured');
  // Normalize shape: expect array or object with fields: id, name, poster, description, ...
  const item = Array.isArray(data) ? data[0] : data;
  if (!item) return null;
  return normalizeItem(item);
}

/**
 * PUBLIC_INTERFACE
 * getRail
 * Generic rail loader for a given endpoint path.
 */
export async function getRail(endpointPath) {
  /** Loads a list of items from an API rail endpoint and maps to UI-friendly fields. */
  if (!endpointPath || typeof endpointPath !== 'string') {
    return [];
  }
  const list = await fetchJSON(endpointPath);
  if (!Array.isArray(list)) return [];
  return list.map(normalizeItem);
}

/**
 * PUBLIC_INTERFACE
 * getInfo
 * Fetches detailed info for a show/movie by id.
 */
export async function getInfo(id) {
  /** Calls /api/info/{id} and returns normalized fields. */
  if (!id) throw new Error('getInfo requires id');
  const data = await fetchJSON(`/api/info/${encodeURIComponent(id)}`);
  return normalizeInfo(data);
}

/**
 * PUBLIC_INTERFACE
 * play
 * Calls /api/play with an id and returns a URL to navigate for video playback.
 */
export async function play(id) {
  /** Calls POST /api/play with JSON { id } and returns the 'url' from server response. */
  if (!id) throw new Error('play requires id');
  const res = await fetchJSON('/api/play', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ id }),
  });
  // Server returns a proxied absolute or relative url; just return as-is and navigate.
  return res?.url;
}

// Helpers

function normalizeItem(raw = {}) {
  // Server returns ShowItem with keys like: id, name, poster (absolute or proxied absolute), description?
  // Map to UI fields: id, title, image
  return {
    id: raw.id ?? raw._id ?? raw.slug ?? String(raw.name || 'unknown'),
    title: raw.name ?? raw.title ?? 'Untitled',
    image: raw.poster ?? raw.image ?? raw.thumbnail ?? '',
  };
}

function normalizeInfo(raw = {}) {
  // Normalize detail fields for overlay
  return {
    id: raw.id ?? raw._id ?? raw.slug ?? '',
    title: raw.name ?? raw.title ?? 'Untitled',
    description: raw.description ?? raw.overview ?? '',
    seasons: raw.seasons ?? 0,
    total_episodes: raw.total_episodes ?? raw.episodes ?? 0,
    poster: raw.poster ?? raw.image ?? '',
    backdrop: raw.backdrop ?? raw.hero ?? '',
  };
}
