/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — chapter.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for chapter image retrieval. Fetches chapter data
 *   from the upstream Vortex Scans /api/chapter endpoint using chapterId.
 *
 * @exports
 *   getChapterImages
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_SITE } = require('../helpers/constants.helper');
const { fetchChapter } = require('../helpers/fetch.helper');

const getChapterImages = async (chapterId) => {
  const cacheKey = `chapter:${chapterId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let data;
  try {
    data = await fetchChapter(chapterId);
  } catch (err) {
    return { error: 'Chapter not found', status: 404 };
  }

  const chapter = data.chapter;
  if (!chapter) return { error: 'Chapter not found', status: 404 };

  const images = (chapter.images || [])
    .sort((a, b) => a.order - b.order)
    .map((img) => img.url);

  const result = {
    data: {
      id: chapter.id,
      slug: chapter.slug,
      number: chapter.number,
      title: chapter.title || null,
      createdAt: chapter.createdAt,
      pageCount: images.length,
      images,
      series: {
        id: chapter.mangaPost?.id,
        title: chapter.mangaPost?.postTitle || null,
        slug: chapter.mangaPost?.slug || null,
        image: chapter.mangaPost?.featuredImage || null,
      },
      team: chapter.team ? { id: chapter.team.id, name: chapter.team.name } : null,
      navigation: {
        previous: data.previousChapter
          ? { slug: data.previousChapter.slug, number: data.previousChapter.number, title: data.previousChapter.title, url: `${VORTEX_SITE}/series/${chapter.mangaPost?.slug}/${data.previousChapter.slug}` }
          : null,
        next: data.nextChapter
          ? { slug: data.nextChapter.slug, number: data.nextChapter.number, title: data.nextChapter.title, url: `${VORTEX_SITE}/series/${chapter.mangaPost?.slug}/${data.nextChapter.slug}` }
          : null,
      },
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.CHAPTER);
  return result;
};

module.exports = { getChapterImages };

// ══════════════════════════════════════════════════════════════ END: chapter.controller.js
