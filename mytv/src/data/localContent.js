/**
 PUBLIC_INTERFACE
 Local data source for Home rails and banner content.
 TODO: Replace with remote data source (e.g., https://5bc9cfc0.api.kavia.app/) via a fetch-based abstraction.
*/

const images = [
  '/images/placeholder1.jpg',
  '/images/placeholder2.jpg',
  '/images/placeholder3.jpg',
  '/images/placeholder4.jpg',
  '/images/placeholder5.jpg',
  '/images/placeholder6.jpg',
  '/images/placeholder7.jpg',
  '/images/placeholder8.jpg',
]

function buildItems(prefix, count = 10) {
  return Array.from({ length: count }).map((_, idx) => ({
    id: `${prefix}-${idx + 1}`,
    title: `${prefix} #${idx + 1}`,
    image: images[idx % images.length],
  }))
}

// PUBLIC_INTERFACE
export function getBanner() {
  return {
    title: 'Featured: The Night Rider',
    subtitle:
      'An unforgettable tale of courage and speed in the neon-lit shadows.',
    image: '/images/placeholder3.jpg',
  }
}

// PUBLIC_INTERFACE
export function getAllRails() {
  return [
    { title: 'Top Trending', items: buildItems('Trending', 12) },
    { title: 'Continue Watching', items: buildItems('Continue', 10) },
    { title: 'Action', items: buildItems('Action', 12) },
    { title: 'Drama', items: buildItems('Drama', 12) },
    { title: 'Horror', items: buildItems('Horror', 12) },
    { title: 'Other Genres', items: buildItems('Other', 12) },
  ]
}

/**
 To connect to a mock backend later:
 - Create a new file src/data/apiContent.js that exports getBanner and getAllRails using fetch.
 - Add environment-based switch in a new src/data/index.js to choose localContent or apiContent.
 - Ensure network calls use same item shape: { id, title, image }.
*/
