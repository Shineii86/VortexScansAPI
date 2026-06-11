const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchVortex } = require('../helpers/fetch.helper');
const { transformMangaList, transformMangaDetail } = require('../extractors/manga.extractor');

async function getMangaList(query) {
  const params = {
    page: parseInt(query.page) || 1,
    perPage: Math.min(parseInt(query.limit) || 48, 100),
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

async function getMangaChapters(slug, query) {
  const cacheKey = cache.getCacheKey('manga-chapters', { slug, ...query });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchVortex({ search: slug, perPage: 100 });
  const post = (data.posts || []).find((p) => p.slug === slug);

  if (!post) {
    return { success: false, error: 'Manga not found', status: 404 };
  }

  const allChapters = (post.chapters || []).map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title || null,
    slug: ch.slug,
    createdAt: ch.createdAt,
    locked: ch.isLocked,
    accessible: ch.isAccessible,
    url: `https://vortexscans.org/series/${slug}/${ch.slug}`,
  }));

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;
  const total = allChapters.length;
  const start = (page - 1) * limit;

  const result = {
    success: true,
    manga: {
      slug: post.slug,
      title: post.postTitle,
      image: post.featuredImage,
    },
    data: allChapters.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_DETAIL);
  return result;
}

module.exports = { getMangaList, getMangaBySlug, getMangaChapters };
