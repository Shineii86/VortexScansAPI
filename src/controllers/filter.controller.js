/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — filter.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for advanced manga filtering. Supports filtering
 *   by series type, status, and genre with configurable sort order
 *   and pagination.
 *
 * @exports
 *   filterManga
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_API } = require('../helpers/constants.helper');
const { transformPost } = require('../extractors/manga.extractor');

// ══════════════════════════════════════════════════════════════
// MANGA FILTERING
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Advanced filter with multiple parameters ----
/**
 * Filters manga by type, status, and/or genre with pagination.
 * All filter parameters are optional — omitting them returns all manga
 * sorted by the specified order.
 *
 * @param {object} query - Request query parameters
 * @param {string} [query.type] - Series type (manhwa/manga/manhua)
 * @param {string} [query.status] - Series status (ongoing/hiatus/completed)
 * @param {string} [query.genre] - Genre ID filter
 * @param {string} [query.sort] - Sort field (default: lastChapterAddedAt)
 * @param {string} [query.direction] - Sort direction (default: desc)
 * @param {number} [query.page=1] - Page number
 * @param {number} [query.limit=48] - Results per page (max 100)
 * @returns {Promise<object>} Filtered manga list with pagination
 * @throws {Error} If Vortex API returns non-OK status
 *
 * @example
 *   const result = await filterManga({ type: "manhwa", status: "ongoing" });
 *   // { success: true, filters: {...}, data: [...], pagination: {...} }
 */
const filterManga = async (query) => {
  const params = {
    page: parseInt(query.page) || 1,
    perPage: Math.min(parseInt(query.limit) || 48, 100),
    view: 'archive',
    orderBy: query.sort || 'lastChapterAddedAt',
    orderDirection: query.direction || 'desc',
  };

  if (query.type) params.seriesType = query.type.toUpperCase();
  if (query.status) params.seriesStatus = query.status.toUpperCase();
  if (query.genre) params.genre = query.genre;

  const cacheKey = cache.getCacheKey('filter', params);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const searchParams = new URLSearchParams(params);
  const response = await fetch(`${VORTEX_API}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  const data = await response.json();

  const result = {
    success: true,
    filters: {
      type: query.type || null,
      status: query.status || null,
      genre: query.genre || null,
      sort: query.sort || 'lastChapterAddedAt',
      direction: query.direction || 'desc',
    },
    data: (data.posts || []).map(transformPost),
    pagination: {
      page: params.page,
      limit: params.perPage,
      total: data.totalCount || 0,
      totalPages: Math.ceil((data.totalCount || 0) / params.perPage),
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
};

module.exports = { filterManga };

// ══════════════════════════════════════════════════════════════ END: filter.controller.js
