/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — manga.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for manga endpoints. Handles listing, detail view,
 *   and chapter retrieval. Integrates with cache, fetch, and extractor
 *   layers for complete request processing.
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
const { fetchVortex, fetchChapters } = require('../helpers/fetch.helper');
const { transformMangaList } = require('../extractors/manga.extractor');

// ══════════════════════════════════════════════════════════════
// MANGA LIST
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Paginated manga list with filtering ----
/**
 * Retrieves a paginated list of manga with optional filtering.
 * Supports search, type, status, genre, sort order, and direction.
 *
 * @param {object} query - Request query parameters
 * @param {number} [query.page=1] - Page number
 * @param {number} [query.limit=48] - Results per page (max 100)
 * @param {string} [query.search] - Search keyword
 * @param {string} [query.type] - Series type (manhwa/manga/manhua)
 * @param {string} [query.status] - Series status (ongoing/hiatus/completed)
 * @param {string} [query.genre] - Genre filter
 * @param {string} [query.order] - Sort field
 * @param {string} [query.direction] - Sort direction (asc/desc)
 * @param {string} [query.hot] - Hot manga filter
 * @returns {Promise<object>} Paginated manga list
 */
const getMangaList = async (query) => {
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
};

// ══════════════════════════════════════════════════════════════
// MANGA DETAIL
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Single manga detail by slug ----
/**
 * Retrieves detailed information for a single manga by slug.
 * Searches the API and finds the matching post. Returns 404 if not found.
 *
 * @param {string} slug - Manga URL slug
 * @param {object} query - Request query parameters
 * @param {number} [query.page=1] - Chapter page number
 * @param {number} [query.limit=50] - Chapters per page
 * @returns {Promise<object>} Manga detail with paginated chapters
 */
const getMangaBySlug = async (slug, query) => {
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

  const chaptersData = await fetchChapters(post.id, page, limit);
  const allChapters = (chaptersData.post?.chapters || []).map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title || null,
    slug: ch.slug,
    createdAt: ch.createdAt,
    locked: ch.isLocked,
    accessible: ch.isAccessible,
  }));

  const total = chaptersData.totalChapterCount || allChapters.length;

  const result = {
    success: true,
    data: {
      id: post.id,
      slug: post.slug,
      title: post.postTitle,
      image: post.featuredImage,
      type: post.seriesType?.toLowerCase(),
      status: post.seriesStatus?.toLowerCase(),
      hot: post.hot,
      pinned: post.isPinned,
      rating: post.averageRating,
      genres: (post.genres || []).map((g) => ({ id: g.id, name: g.name })),
      chapters: allChapters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_DETAIL);
  return result;
};

// ══════════════════════════════════════════════════════════════
// MANGA CHAPTERS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Paginated chapter list for a manga ----
/**
 * Retrieves all chapters for a manga with pagination.
 * Returns manga metadata (title, image) along with chapter list.
 *
 * @param {string} slug - Manga URL slug
 * @param {object} query - Request query parameters
 * @param {number} [query.page=1] - Chapter page number
 * @param {number} [query.limit=50] - Chapters per page
 * @returns {Promise<object>} Chapter list with manga info
 */
const getMangaChapters = async (slug, query) => {
  const cacheKey = cache.getCacheKey('manga-chapters', { slug, ...query });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchVortex({ search: slug, perPage: 100 });
  const post = (data.posts || []).find((p) => p.slug === slug);

  if (!post) {
    return { success: false, error: 'Manga not found', status: 404 };
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;

  const chaptersData = await fetchChapters(post.id, page, limit);
  const allChapters = (chaptersData.post?.chapters || []).map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title || null,
    slug: ch.slug,
    createdAt: ch.createdAt,
    locked: ch.isLocked,
    accessible: ch.isAccessible,
    url: `https://vortexscans.org/series/${slug}/${ch.slug}`,
  }));

  const total = chaptersData.totalChapterCount || allChapters.length;

  const result = {
    success: true,
    manga: {
      slug: post.slug,
      title: post.postTitle,
      image: post.featuredImage,
    },
    data: allChapters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_DETAIL);
  return result;
};

module.exports = { getMangaList, getMangaBySlug, getMangaChapters };

// ══════════════════════════════════════════════════════════════ END: manga.controller.js
