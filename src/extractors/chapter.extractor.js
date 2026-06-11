/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — chapter.extractor.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   HTML parsing utilities for extracting chapter images and metadata
 *   from Vortex Scans chapter pages. Uses regex pattern matching
 *   on storage.vortexscans.org CDN URLs.
 *
 * @exports
 *   extractChapterImages, extractChapterInfo
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// IMAGE EXTRACTION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Extract chapter page images from HTML ----
/**
 * Extracts all chapter page image URLs from the HTML source.
 * Matches URLs from the Vortex Scans storage CDN with the pattern:
 * https://storage.vortexscans.org/upload/series/{slug}/{chapter-id}/page-{num}_{ts}-{hash}.webp
 *
 * Deduplicates images and returns them in page order.
 *
 * @param {string} html - Raw HTML from chapter page
 * @returns {Array<{page: number, url: string}>} Ordered array of page images
 *
 * @example
 *   const images = extractChapterImages(html);
 *   // [{ page: 1, url: "https://storage.vortexscans.org/..." }, ...]
 */
const extractChapterImages = (html) => {
  const imageRegex = /https:\/\/storage\.vortexscans\.org\/upload\/series\/[^"'\s]+page-[^"'\s]+\.webp/g;
  const matches = html.match(imageRegex) || [];

  // NOTE: Deduplicate — same image may appear multiple times in HTML
  const seen = new Set();
  const images = [];

  for (const url of matches) {
    if (!seen.has(url)) {
      seen.add(url);
      images.push(url);
    }
  }

  return images.map((url, index) => ({
    page: index + 1,
    url,
  }));
};

// ══════════════════════════════════════════════════════════════
// CHAPTER INFO EXTRACTION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Extract chapter navigation and title ----
/**
 * Extracts chapter metadata from the HTML page, including title
 * and previous/next chapter slugs for navigation.
 *
 * @param {string} html - Raw HTML from chapter page
 * @returns {{title: string|null, prevChapter: string|null, nextChapter: string|null}}
 *
 * @example
 *   const info = extractChapterInfo(html);
 *   // { title: "Chapter 1", prevChapter: "chapter-0", nextChapter: "chapter-2" }
 */
const extractChapterInfo = (html) => {
  // NOTE: Extract title from <title> tag — remove site suffix
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(' - Vortex Scans', '').trim() : null;

  // NOTE: Match navigation links via aria-label attribute
  const prevMatch = html.match(/href="[^"]*\/(chapter-[^"]+)"[^>]*aria-label="Prev"/i);
  const nextMatch = html.match(/href="[^"]*\/(chapter-[^"]+)"[^>]*aria-label="Next"/i);

  return {
    title,
    prevChapter: prevMatch ? prevMatch[1] : null,
    nextChapter: nextMatch ? nextMatch[1] : null,
  };
};

module.exports = { extractChapterImages, extractChapterInfo };

// ══════════════════════════════════════════════════════════════ END: chapter.extractor.js
