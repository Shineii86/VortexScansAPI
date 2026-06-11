const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');

async function getGenres() {
  const cacheKey = 'genres:all';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { VORTEX_API } = require('../helpers/constants.helper');
  const genreMap = new Map();

  for (let page = 1; page <= 8; page++) {
    const response = await fetch(
      `${VORTEX_API}?page=${page}&perPage=100&view=archive&orderBy=lastChapterAddedAt&orderDirection=desc`
    );

    if (!response.ok) break;
    const data = await response.json();

    for (const post of data.posts || []) {
      for (const genre of post.genres || []) {
        if (!genreMap.has(genre.id)) {
          genreMap.set(genre.id, { id: genre.id, name: genre.name });
        }
      }
    }

    if ((data.posts || []).length < 100) break;
  }

  const genres = Array.from(genreMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const result = { success: true, data: genres, total: genres.length };

  cache.set(cacheKey, result, CACHE_TTL.GENRES);
  return result;
}

async function getStatus() {
  const cacheKey = 'status:all';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = {
    success: true,
    data: {
      statuses: [
        { id: 'ongoing', name: 'Ongoing' },
        { id: 'hiatus', name: 'Hiatus' },
        { id: 'completed', name: 'Completed' },
        { id: 'cancelled', name: 'Cancelled' },
        { id: 'dropped', name: 'Dropped' },
      ],
      types: [
        { id: 'manhwa', name: 'Manhwa' },
        { id: 'manhua', name: 'Manhua' },
        { id: 'manga', name: 'Manga' },
      ],
      sortOptions: [
        { id: 'lastChapterAddedAt', name: 'Latest Update' },
        { id: 'averageRating', name: 'Top Rated' },
        { id: 'createdAt', name: 'Newest' },
      ],
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.STATUS);
  return result;
}

module.exports = { getGenres, getStatus };
