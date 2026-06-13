/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — home.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for the home page endpoint. Aggregates multiple
 *   parallel API requests for latest, hot, and top rated manga.
 *
 * @exports
 *   getHome
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchQuery, fetchCollections } = require('../helpers/fetch.helper');

const getHome = async () => {
  const cacheKey = 'home:data';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const [latestRes, hotRes, topRatedRes, collectionsRes] = await Promise.all([
    fetchQuery({ page: 1, perPage: 20, view: 'archive', orderBy: 'lastChapterAddedAt', orderDirection: 'desc' }),
    fetchQuery({ page: 1, perPage: 10, view: 'archive', hot: true }),
    fetchQuery({ page: 1, perPage: 10, view: 'archive', orderBy: 'averageRating', orderDirection: 'desc' }),
    fetchCollections().catch(() => ({ collections: [] })),
  ]);

  const transformPost = (p) => ({
    id: p.id,
    slug: p.slug,
    title: p.postTitle,
    image: p.featuredImage,
    type: p.seriesType?.toLowerCase(),
    status: p.seriesStatus?.toLowerCase(),
    hot: p.hot,
    rating: p.averageRating,
    genres: (p.genres || []).map((g) => ({ id: g.id, name: g.name })),
    chapters: (p.chapters || []).map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title || null,
      slug: ch.slug,
      createdAt: ch.createdAt,
    })),
  });

  const collections = (collectionsRes.collections || []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    coverImage: c.coverImage,
    worksCount: c.worksCount,
    likesCount: c.likesCount,
  }));

  const result = {
    latest: (latestRes.posts || []).map(transformPost),
    hot: (hotRes.posts || []).map(transformPost),
    topRated: (topRatedRes.posts || []).map(transformPost),
    collections,
    stats: {
      totalManga: latestRes.totalCount || 0,
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.HOME);
  return result;
};

module.exports = { getHome };

// ══════════════════════════════════════════════════════════════ END: home.controller.js
