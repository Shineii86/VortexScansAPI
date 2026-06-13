/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — filter.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for advanced manga filtering. Supports filtering
 *   by series type, status, and genre with pagination.
 *
 * @exports
 *   filterManga
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchQuery } = require('../helpers/fetch.helper');

const filterManga = async (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(query.limit) || 48, 1), 100);

  const params = {
    page,
    perPage,
    view: 'archive',
    orderBy: query.sort || 'lastChapterAddedAt',
    orderDirection: query.direction || 'desc',
  };

  if (query.type) params.seriesType = query.type.toUpperCase();
  if (query.status) params.seriesStatus = query.status.toUpperCase();

  const needsLocalGenreFilter = !!query.genre;
  if (needsLocalGenreFilter) {
    params.perPage = 360;
    params.page = 1;
  }

  const cacheKey = cache.getCacheKey('filter', { ...params, genre: query.genre });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchQuery(params);
  let posts = (data.posts || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.postTitle,
    image: p.featuredImage,
    type: p.seriesType?.toLowerCase(),
    status: p.seriesStatus?.toLowerCase(),
    rating: p.averageRating,
    genres: (p.genres || []).map((g) => ({ id: g.id, name: g.name })),
  }));

  let totalCount = data.totalCount || 0;

  if (needsLocalGenreFilter) {
    const genreId = parseInt(query.genre);
    posts = posts.filter((m) => m.genres && m.genres.some((g) => g.id === genreId));
    totalCount = posts.length;
    const start = (page - 1) * perPage;
    posts = posts.slice(start, start + perPage);
  }

  const lastPage = Math.ceil(totalCount / perPage) || 1;
  const result = {
    data: posts,
    pagination: {
      total: totalCount,
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

module.exports = { filterManga };

// ══════════════════════════════════════════════════════════════ END: filter.controller.js
