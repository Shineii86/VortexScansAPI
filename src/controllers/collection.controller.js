/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — collection.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for collections endpoints. Fetches curated
 *   manga collections from the upstream Vortex Scans API.
 *
 * @exports
 *   getCollections, getCollectionDetail
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchCollections, fetchCollectionDetail } = require('../helpers/fetch.helper');

const getCollections = async () => {
  const cacheKey = 'collections:all';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchCollections();
  const collections = (data.collections || []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    coverImage: c.coverImage,
    bannerImage: c.bannerImage,
    worksCount: c.worksCount,
    likesCount: c.likesCount,
    totalViews: c.totalViews,
  }));

  cache.set(cacheKey, collections, CACHE_TTL.COLLECTIONS);
  return collections;
};

const getCollectionDetail = async (slug) => {
  const cacheKey = `collection:${slug}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let data;
  try {
    data = await fetchCollectionDetail(slug);
  } catch (err) {
    return { error: 'Collection not found', status: 404 };
  }

  const c = data.collection;
  if (!c) return { error: 'Collection not found', status: 404 };

  const result = {
    data: {
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      coverImage: c.coverImage,
      bannerImage: c.bannerImage,
      artworkImage: c.artworkImage,
      totalViews: c.totalViews,
      likesCount: c.likesCount,
      worksCount: c.worksCount,
      tags: c.tags || [],
      works: (c.works || []).map((w) => ({
        position: w.position,
        id: w.post?.id,
        slug: w.post?.slug,
        title: w.post?.postTitle,
        image: w.post?.featuredImage,
        type: w.post?.seriesType?.toLowerCase(),
        rating: w.post?.averageRating,
        totalChapterLikes: w.post?.totalChapterLikes,
        genres: (w.post?.genres || []).map((g) => ({ id: g.id, name: g.name })),
      })),
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.COLLECTIONS);
  return result;
};

module.exports = { getCollections, getCollectionDetail };

// ══════════════════════════════════════════════════════════════ END: collection.controller.js
