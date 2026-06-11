/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — chapter.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for chapter image extraction. Fetches chapter HTML
 *   from vortexscans.org, extracts image URLs from storage CDN,
 *   and returns navigation metadata (prev/next chapters).
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
const { extractChapterImages, extractChapterInfo } = require('../extractors/chapter.extractor');

// ══════════════════════════════════════════════════════════════
// CHAPTER IMAGE RETRIEVAL
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Extract images + navigation from chapter page ----
/**
 * Fetches a chapter page from Vortex Scans and extracts:
 * - All page image URLs from the storage CDN
 * - Chapter title from the HTML title tag
 * - Previous/next chapter slugs for navigation
 *
 * Returns 404 if the chapter page doesn't exist.
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

  const url = `${VORTEX_SITE}/series/${slug}/${chapterSlug}`;
  const response = await fetch(url);

  if (!response.ok) {
    return { success: false, error: 'Chapter not found', status: 404 };
  }

  const html = await response.text();
  const images = extractChapterImages(html);
  const info = extractChapterInfo(html);

  const result = {
    success: true,
    manga: { slug },
    chapter: {
      slug: chapterSlug,
      title: info.title,
      images,
      totalPages: images.length,
      navigation: {
        prev: info.prevChapter
          ? { slug: info.prevChapter, url: `${VORTEX_SITE}/series/${slug}/${info.prevChapter}` }
          : null,
        next: info.nextChapter
          ? { slug: info.nextChapter, url: `${VORTEX_SITE}/series/${slug}/${info.nextChapter}` }
          : null,
      },
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.CHAPTER_IMAGES);
  return result;
};

module.exports = { getChapterImages };

// ══════════════════════════════════════════════════════════════ END: chapter.controller.js
