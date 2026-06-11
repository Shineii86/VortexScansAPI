const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_API } = require('../helpers/constants.helper');
const { transformPost } = require('../extractors/manga.extractor');

async function searchManga(query) {
  const keyword = query.q || query.keyword || query.search;
  if (!keyword) {
    return { success: false, error: 'Search term required (use ?q=keyword)' };
  }

  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 20, 100);

  const cacheKey = cache.getCacheKey('search', { keyword, page, limit });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const response = await fetch(
    `${VORTEX_API}?page=${page}&perPage=${limit}&view=archive&search=${encodeURIComponent(keyword)}&orderBy=lastChapterAddedAt&orderDirection=desc`
  );

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  const data = await response.json();

  const result = {
    success: true,
    query: keyword,
    data: (data.posts || []).map(transformPost),
    pagination: {
      page,
      limit,
      total: data.totalCount || 0,
      totalPages: Math.ceil((data.totalCount || 0) / limit),
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
}

module.exports = { searchManga };
