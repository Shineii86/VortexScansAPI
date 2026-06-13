/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — search.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for manga search. Uses /api/posts with search param
 *   for server-side full-text search with pagination.
 *
 * @exports
 *   searchManga
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchPosts } = require('../helpers/fetch.helper');

const searchManga = async (query) => {
  const keyword = query.q || query.keyword || query.search;
  if (!keyword) return { error: 'Search term required (use ?q=keyword)' };

  const page = Math.max(parseInt(query.page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(query.limit) || 20, 1), 100);

  const cacheKey = cache.getCacheKey('search', { keyword, page, perPage });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchPosts({ search: keyword, page, perPage });
  const posts = (data.posts || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.postTitle,
    image: p.featuredImage,
    type: p.seriesType?.toLowerCase(),
    status: p.seriesStatus?.toLowerCase(),
    rating: p.averageRating,
    genres: (p.genres || []).map((g) => ({ id: g.id, name: g.name })),
    chaptersCount: p._count?.chapters || 0,
  }));

  const total = data.totalCount || 0;
  const lastPage = Math.ceil(total / perPage) || 1;
  const result = {
    data: posts,
    pagination: {
      total,
      perPage,
      currentPage: page,
      lastPage,
      hasNext: page < lastPage,
      hasPrevious: page > 1,
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
};

module.exports = { searchManga };

// ══════════════════════════════════════════════════════════════ END: search.controller.js
