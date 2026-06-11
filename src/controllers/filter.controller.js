const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_API } = require('../helpers/constants.helper');
const { transformPost } = require('../extractors/manga.extractor');

async function filterManga(query) {
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
}

module.exports = { filterManga };
