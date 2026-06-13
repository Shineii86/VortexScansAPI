/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — manga.extractor.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Data transformation functions for manga and chapter objects.
 *   Normalizes raw Vortex API responses into consistent
 *   structured format for API consumers.
 *
 * @exports
 *   transformPost, transformChapter, transformMangaList, transformMangaDetail
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// SINGLE ITEM TRANSFORMERS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Transform single manga post object ----
/**
 * Transforms a raw Vortex API post object into a normalized
 * manga object with consistent field names and structure.
 *
 * @param {object} post - Raw post from Vortex API
 * @returns {object} Normalized manga object
 *
 * @example
 *   const manga = transformPost(rawPost);
 *   // { id, slug, title, image, type, status, ... }
 */
const transformPost = (post) => ({
  id: post.id,
  slug: post.slug,
  title: post.postTitle,
  image: post.featuredImage,
  type: post.seriesType?.toLowerCase(),
  status: post.seriesStatus?.toLowerCase(),
  hot: post.hot,
  pinned: post.isPinned,
  sale: post.saleActive
    ? { active: true, percentage: post.salePercentage, endDate: post.saleEndDate }
    : { active: false },
  rating: post.averageRating,
  genres: (post.genres || []).map((g) => ({ id: g.id, name: g.name })),
  chapters: (post.chapters || []).map(transformChapter),
});

// ---- FEATURE: Transform single chapter object ----
/**
 * Transforms a raw Vortex API chapter object into a normalized
 * chapter object with consistent field names.
 *
 * @param {object} ch - Raw chapter from Vortex API
 * @returns {object} Normalized chapter object
 *
 * @example
 *   const chapter = transformChapter(rawChapter);
 *   // { id, number, title, slug, createdAt, locked, accessible }
 */
const transformChapter = (ch) => ({
  id: ch.id,
  number: ch.number,
  title: ch.title || null,
  slug: ch.slug,
  createdAt: ch.createdAt,
  locked: ch.isLocked,
  accessible: ch.isAccessible,
});

// ══════════════════════════════════════════════════════════════
// COLLECTION TRANSFORMERS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Transform paginated manga list ----
/**
 * Transforms a full API response (with posts array and totalCount)
 * into a paginated manga list with metadata.
 *
 * @param {object} data - Raw API response with posts and totalCount
 * @param {object} params - Request parameters (page, perPage)
 * @returns {object} Paginated manga list response
 *
 * @example
 *   const result = transformMangaList(apiResponse, { page: 1, perPage: 48 });
 *   // { success: true, data: [...], pagination: { page, limit, total, totalPages } }
 */
const transformMangaList = (data, params) => ({
  success: true,
  data: (data.posts || []).map(transformPost),
  pagination: {
    page: params.page || 1,
    limit: params.perPage || 48,
    total: data.totalCount || 0,
    totalPages: Math.ceil((data.totalCount || 0) / (params.perPage || 48)),
  },
});

// ---- FEATURE: Transform manga detail with paginated chapters ----
/**
 * Transforms a single manga post into a detail response with
 * paginated chapters. Includes full manga info plus chapter subset.
 *
 * @param {object} post - Raw manga post from Vortex API
 * @param {number} page - Chapter page number
 * @param {number} limit - Chapters per page
 * @returns {object} Manga detail response with chapters
 *
 * @example
 *   const detail = transformMangaDetail(post, 1, 50);
 *   // { success: true, data: { ...mangaInfo, chapters: [...], pagination: {...} } }
 */
const transformMangaDetail = (post, page, limit) => {
  const allChapters = (post.chapters || []).map(transformChapter);
  const total = allChapters.length;
  const start = (page - 1) * limit;

  return {
    success: true,
    data: {
      ...transformPost(post),
      chapters: allChapters.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

module.exports = {
  transformPost,
  transformChapter,
  transformMangaList,
};

// ══════════════════════════════════════════════════════════════ END: manga.extractor.js
