const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { transformMangaList, transformMangaDetail } = require('../extractors/manga.extractor');

const VORTEX_API = 'https://api.vortexscans.org/api/query';

async function fetchVortex(params = {}) {
  const defaults = {
    page: 1,
    perPage: 48,
    view: 'archive',
    orderBy: 'lastChapterAddedAt',
    orderDirection: 'desc',
  };

  const searchParams = new URLSearchParams({ ...defaults, ...params });
  const response = await fetch(`${VORTEX_API}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  return response.json();
}

async function getMangaList(query) {
  const params = {
    page: parseInt(query.page) || 1,
    perPage: parseInt(query.limit) || 48,
  };

  if (query.search) params.search = query.search;
  if (query.type) params.seriesType = query.type.toUpperCase();
  if (query.status) params.seriesStatus = query.status.toUpperCase();
  if (query.genre) params.genre = query.genre;
  if (query.order) params.orderBy = query.order;
  if (query.direction) params.orderDirection = query.direction;
  if (query.hot === 'true') params.hot = true;

  const cacheKey = cache.getCacheKey('manga', params);

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchVortex(params);
  const result = transformMangaList(data, params);

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
}

async function getMangaBySlug(slug, query) {
  const cacheKey = cache.getCacheKey('manga-detail', { slug, ...query });

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchVortex({ search: slug, perPage: 100 });
  const post = (data.posts || []).find((p) => p.slug === slug);

  if (!post) {
    return { success: false, error: 'Manga not found', status: 404 };
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;
  const result = transformMangaDetail(post, page, limit);

  cache.set(cacheKey, result, CACHE_TTL.MANGA_DETAIL);
  return result;
}

module.exports = { getMangaList, getMangaBySlug };
