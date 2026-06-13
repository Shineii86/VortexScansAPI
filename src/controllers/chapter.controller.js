/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — chapter.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for chapter image retrieval. Fetches chapter data
 *   from the Vortex Scans /api/chapter endpoint, returning page images,
 *   navigation metadata (prev/next chapters), and chapter details.
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

// ══════════════════════════════════════════════════════════════
// CHAPTER IMAGE RETRIEVAL
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Fetch chapter images + navigation from API ----
/**
 * Fetches chapter data from the Vortex Scans upstream API.
 * Returns all page image URLs, chapter metadata, and prev/next navigation.
 *
 * Returns 404 if the chapter doesn't exist or is not accessible.
 *
 * @param {string} slug - Manga URL slug
 * @param {string} chapterSlug - Chapter URL slug (e.g., "chapter-1")
 * @returns {Promise<object>} Chapter images with navigation metadata
 *
 * @example
 *   const result = await getChapterImages("solo-leveling", "chapter-1");
 *   // { success: true, manga: {...}, chapter: { images: [...], navigation: {...} } }
 */
const getChapterImages = async (slug, chapterSlug) => {
  const cacheKey = cache.getCacheKey('chapter', { slug, chapterSlug });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let data;
  try {
    data = await fetchChapter(slug, chapterSlug);
  } catch (err) {
    return { success: false, error: 'Chapter not found', status: 404 };
  }

  const chapter = data.chapter;
  if (!chapter) {
    return { success: false, error: 'Chapter not found', status: 404 };
  }

  const images = (chapter.images || [])
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      page: img.order + 1,
      url: img.url,
      width: img.width,
      height: img.height,
    }));

  const result = {
    success: true,
    manga: {
      slug,
      title: chapter.mangaPost?.postTitle || null,
      image: chapter.mangaPost?.featuredImage || null,
    },
    chapter: {
      id: chapter.id,
      slug: chapter.slug,
      number: chapter.number,
      title: chapter.title || null,
      createdAt: chapter.createdAt,
      totalPages: images.length,
      images,
      team: chapter.team || null,
      navigation: {
        prev: data.previousChapter
          ? { slug: data.previousChapter.slug, number: data.previousChapter.number, title: data.previousChapter.title, url: `${VORTEX_SITE}/series/${slug}/${data.previousChapter.slug}` }
          : null,
        next: data.nextChapter
          ? { slug: data.nextChapter.slug, number: data.nextChapter.number, title: data.nextChapter.title, url: `${VORTEX_SITE}/series/${slug}/${data.nextChapter.slug}` }
          : null,
      },
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.CHAPTER_IMAGES);
  return result;
};

module.exports = { getChapterImages };

// ══════════════════════════════════════════════════════════════ END: chapter.controller.js
