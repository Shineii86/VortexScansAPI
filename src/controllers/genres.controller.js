const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { transformGenre } = require('../extractors/manga.extractor');

const VORTEX_API = 'https://api.vortexscans.org/api/query';

async function getGenres() {
  const cacheKey = 'genres:all';

  const cached = cache.get(cacheKey);
  if (cached) return cached;

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
          genreMap.set(genre.id, transformGenre(genre));
        }
      }
    }

    if ((data.posts || []).length < 100) break;
  }

  const genres = Array.from(genreMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const result = { success: true, data: genres, total: genres.length };

  cache.set(cacheKey, result, CACHE_TTL.GENRES);
  return result;
}

module.exports = { getGenres };
