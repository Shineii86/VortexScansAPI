const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_SITE } = require('../helpers/constants.helper');
const { extractChapterImages, extractChapterInfo } = require('../extractors/chapter.extractor');

async function getChapterImages(slug, chapterSlug) {
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
        prev: info.prevChapter ? { slug: info.prevChapter, url: `${VORTEX_SITE}/series/${slug}/${info.prevChapter}` } : null,
        next: info.nextChapter ? { slug: info.nextChapter, url: `${VORTEX_SITE}/series/${slug}/${info.nextChapter}` } : null,
      },
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.CHAPTER_IMAGES);
  return result;
}

module.exports = { getChapterImages };
