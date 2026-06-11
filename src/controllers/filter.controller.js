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

  // NOTE: Upstream API supports seriesType and seriesStatus, but NOT genre
  // For genre filtering, fetch large set and filter locally
  const needsLocalGenreFilter = !!query.genre;
  if (needsLocalGenreFilter) {
    params.perPage = 360;
    params.page = 1;
  }

  const cacheKey = cache.getCacheKey('filter', params);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const searchParams = new URLSearchParams(params);
  const response = await fetch(`${VORTEX_API}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  const data = await response.json();
  let posts = (data.posts || []).map(transformPost);
  let totalCount = data.totalCount || 0;

  // NOTE: Client-side genre filter — match genre ID in post's genre list
  if (needsLocalGenreFilter) {
    const genreId = parseInt(query.genre);
    posts = posts.filter((m) =>
      m.genres && m.genres.some((g) => g.id === genreId)
    );
    totalCount = posts.length;

    // NOTE: Paginate locally after filtering
    const start = (params.page - 1) * params.perPage;
    posts = posts.slice(start, start + params.perPage);
  }

  const result = {
    success: true,
    filters: {
      type: query.type || null,
      status: query.status || null,
      genre: query.genre || null,
      sort: query.sort || 'lastChapterAddedAt',
      direction: query.direction || 'desc',
    },
    data: posts,
    pagination: {
      page: needsLocalGenreFilter ? parseInt(query.page) || 1 : params.page,
      limit: needsLocalGenreFilter ? (parseInt(query.limit) || 48) : params.perPage,
      total: totalCount,
      totalPages: Math.ceil(totalCount / (needsLocalGenreFilter ? (parseInt(query.limit) || 48) : params.perPage)),
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
};

module.exports = { filterManga };

// ══════════════════════════════════════════════════════════════ END: filter.controller.js
