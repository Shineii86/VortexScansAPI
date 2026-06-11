/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — search.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for manga search endpoint. Performs full-text
 *   search against the Vortex Scans API with pagination and
 *   sorting options.
 *
 * @exports
 *   searchManga
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_API } = require('../helpers/constants.helper');
const { transformPost } = require('../extractors/manga.extractor');

// ══════════════════════════════════════════════════════════════
// MANGA SEARCH
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Full-text manga search with pagination ----
/**
 * Searches for manga by keyword using the Vortex Scans API.
 * Supports multiple query parameter names (q, keyword, search).
 * Returns paginated results sorted by latest chapter update.
 *
 * @param {object} query - Request query parameters
 * @param {string} query.q|keyword|search - Search keyword (required)
 * @param {number} [query.page=1] - Page number
 * @param {number} [query.limit=20] - Results per page (max 100)
 * @returns {Promise<object>} Search results with pagination
 * @throws {Error} If Vortex API returns non-OK status
 *
 * @example
 *   const results = await searchManga({ q: "naruto", page: 1 });
 *   // { success: true, query: "naruto", data: [...], pagination: {...} }
 */
const searchManga = async (query) => {
  const keyword = query.q || query.keyword || query.search;
  if (!keyword) {
    return { success: false, error: 'Search term required (use ?q=keyword)' };
  }

  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 20, 100);

  const cacheKey = cache.getCacheKey('search', { keyword, page, limit });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // NOTE: Upstream API ignores search param — fetch large set and filter locally
  const response = await fetch(
    `${VORTEX_API}?page=1&perPage=360&view=archive&orderBy=lastChapterAddedAt&orderDirection=desc`
  );

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  const data = await response.json();
  const allPosts = (data.posts || []).map(transformPost);

  // NOTE: Client-side case-insensitive title filter
  const query = keyword.toLowerCase();
  const filtered = allPosts.filter((m) =>
    m.title && m.title.toLowerCase().includes(query)
  );

  // NOTE: Paginate the filtered results
  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const result = {
    success: true,
    query: keyword,
    data: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
};

module.exports = { searchManga };

// ══════════════════════════════════════════════════════════════ END: search.controller.js
