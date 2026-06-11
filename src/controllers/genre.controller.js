/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — genre.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for genres and status metadata endpoints.
 *   Aggregates all unique genres across multiple pages of manga data.
 *   Returns static metadata for available statuses, types, and sort options.
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

// ══════════════════════════════════════════════════════════════
// GENRE AGGREGATION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Aggregate all unique genres from manga data ----
/**
 * Fetches multiple pages of manga data to extract all unique genres.
 * Iterates through up to 8 pages (800 manga) to build a complete
 * genre list. Stops early if fewer than 100 results are returned.
 *
 * @returns {Promise<object>} Genre list with total count
 *
 * @example
 *   const genres = await getGenres();
 *   // { success: true, data: [{ id: 1, name: "Action" }, ...], total: 35 }
 */
const getGenres = async () => {
  const cacheKey = 'genres:all';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { VORTEX_API } = require('../helpers/constants.helper');
  const genreMap = new Map();

  // NOTE: Paginate through manga to collect all unique genres
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

    // NOTE: Early exit — no more pages available
    if ((data.posts || []).length < 100) break;
  }

  const genres = Array.from(genreMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const result = { success: true, data: genres, total: genres.length };

  cache.set(cacheKey, result, CACHE_TTL.GENRES);
  return result;
};

// ══════════════════════════════════════════════════════════════
// STATUS & TYPES METADATA
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Static metadata for statuses, types, sort options ----
/**
 * Returns available manga statuses, series types, and sort options.
 * This is static data — cached for 24 hours since it rarely changes.
 *
 * @returns {Promise<object>} Statuses, types, and sort options
 *
 * @example
 *   const status = await getStatus();
 *   // { success: true, data: { statuses: [...], types: [...], sortOptions: [...] } }
 */
const getStatus = async () => {
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
};

module.exports = { getGenres, getStatus };

// ══════════════════════════════════════════════════════════════ END: genre.controller.js
