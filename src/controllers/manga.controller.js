/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — manga.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for manga endpoints. Handles listing, detail view,
 *   and chapter retrieval. Returns { data, pagination } format.
 *
 * @exports
 *   getMangaList, getMangaBySlug, getMangaChapters
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchQuery, fetchPosts, fetchChapters } = require('../helpers/fetch.helper');

const sanitizePage = (val) => Math.max(parseInt(val) || 1, 1);
const sanitizeLimit = (val, max = 100) => Math.min(Math.max(parseInt(val) || 48, 1), max);

const makePagination = (total, perPage, currentPage) => {
  const lastPage = Math.ceil(total / perPage) || 1;
  return {
    total,
    perPage,
    currentPage,
    lastPage,
    hasNext: currentPage < lastPage,
    hasPrevious: currentPage > 1,
  };
};

// ══════════════════════════════════════════════════════════════
// MANGA LIST
// ══════════════════════════════════════════════════════════════

const getMangaList = async (query) => {
  const page = sanitizePage(query.page);
  const perPage = sanitizeLimit(query.limit, 100);

  const params = { page, perPage };
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

  const data = await fetchQuery(params);
  const posts = (data.posts || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.postTitle,
    image: p.featuredImage,
    type: p.seriesType?.toLowerCase(),
    status: p.seriesStatus?.toLowerCase(),
    hot: p.hot,
    pinned: p.isPinned,
    rating: p.averageRating,
    genres: (p.genres || []).map((g) => ({ id: g.id, name: g.name })),
    chapters: (p.chapters || []).map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title || null,
      slug: ch.slug,
      createdAt: ch.createdAt,
      locked: ch.isLocked,
      accessible: ch.isAccessible,
    })),
  }));

  const total = data.totalCount || 0;
  const result = {
    data: posts,
    pagination: makePagination(total, perPage, page),
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
};

// ══════════════════════════════════════════════════════════════
// MANGA DETAIL
// ══════════════════════════════════════════════════════════════

const getMangaBySlug = async (slug, query) => {
  const cacheKey = cache.getCacheKey('manga-detail', { slug });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchPosts({ search: slug, perPage: 100 });
  const post = (data.posts || []).find((p) => p.slug === slug);

  if (!post) return { error: 'Manga not found', status: 404 };

  const page = sanitizePage(query.page);
  const limit = sanitizeLimit(query.limit, 100);

  const chaptersData = await fetchChapters(post.id);
  const total = chaptersData.totalChapterCount || 0;
  const allChapters = (chaptersData.post?.chapters || []);

  const start = (page - 1) * limit;
  const paginatedChapters = allChapters.slice(start, start + limit).map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title || null,
    slug: ch.slug,
    createdAt: ch.createdAt,
    locked: ch.isLocked,
    accessible: ch.isAccessible,
    price: ch.price || 0,
    likesCount: ch.likesCount || 0,
    commentsCount: ch._count?.comments || 0,
  }));

  const result = {
    data: {
      id: post.id,
      slug: post.slug,
      title: post.postTitle,
      alternativeTitles: post.alternativeTitles || null,
      image: post.featuredImage,
      type: post.seriesType?.toLowerCase(),
      status: post.seriesStatus?.toLowerCase(),
      hot: post.hot,
      isNew: post.isNew,
      pinned: post.isPinned,
      rating: post.averageRating,
      totalViews: post.totalViews || 0,
      releaseDate: post.releaseDate || null,
      lastChapterAddedAt: post.lastChapterAddedAt || null,
      genres: (post.genres || []).map((g) => ({ id: g.id, name: g.name })),
      chapters: paginatedChapters,
    },
    pagination: makePagination(total, limit, page),
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_DETAIL);
  return result;
};

// ══════════════════════════════════════════════════════════════
// MANGA CHAPTERS
// ══════════════════════════════════════════════════════════════

const getMangaChapters = async (slug, query) => {
  const cacheKey = cache.getCacheKey('manga-chapters', { slug });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchPosts({ search: slug, perPage: 100 });
  const post = (data.posts || []).find((p) => p.slug === slug);

  if (!post) return { error: 'Manga not found', status: 404 };

  const page = sanitizePage(query.page);
  const limit = sanitizeLimit(query.limit, 100);

  const chaptersData = await fetchChapters(post.id);
  const total = chaptersData.totalChapterCount || 0;
  const allChapters = (chaptersData.post?.chapters || []);

  const start = (page - 1) * limit;
  const paginatedChapters = allChapters.slice(start, start + limit).map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title || null,
    slug: ch.slug,
    createdAt: ch.createdAt,
    updatedAt: ch.updatedAt,
    locked: ch.isLocked,
    accessible: ch.isAccessible,
    price: ch.price || 0,
    likesCount: ch.likesCount || 0,
    commentsCount: ch._count?.comments || 0,
    url: `https://vortexscans.org/series/${slug}/${ch.slug}`,
  }));

  const result = {
    data: {
      manga: {
        id: post.id,
        slug: post.slug,
        title: post.postTitle,
        image: post.featuredImage,
      },
      chapters: paginatedChapters,
    },
    pagination: makePagination(total, limit, page),
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_DETAIL);
  return result;
};

module.exports = { getMangaList, getMangaBySlug, getMangaChapters };

// ══════════════════════════════════════════════════════════════ END: manga.controller.js
