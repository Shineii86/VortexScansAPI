/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — genre.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for genres and status metadata endpoints.
 *   Uses upstream /api/genres directly for accurate genre list.
 *
 * @exports
 *   getGenres, getStatus
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchGenres } = require('../helpers/fetch.helper');

const getGenres = async () => {
  const cacheKey = 'genres:all';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchGenres();
  const genres = (Array.isArray(data) ? data : []).map((g) => ({
    id: g.id,
    name: g.name,
  }));

  cache.set(cacheKey, genres, CACHE_TTL.GENRES);
  return genres;
};

const getStatus = async () => {
  const cacheKey = 'status:all';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = {
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
      { id: 'novel', name: 'Novel' },
    ],
    sortOptions: [
      { id: 'lastChapterAddedAt', name: 'Latest Update' },
      { id: 'averageRating', name: 'Top Rated' },
      { id: 'createdAt', name: 'Newest' },
    ],
  };

  cache.set(cacheKey, result, CACHE_TTL.GENRES);
  return result;
};

module.exports = { getGenres, getStatus };

// ══════════════════════════════════════════════════════════════ END: genre.controller.js
