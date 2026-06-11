/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — chapter.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for chapter image extraction.
 *   Fetches chapter HTML from vortexscans.org, extracts image URLs
 *   from storage CDN, and returns navigation metadata.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { getChapterImages } = require('../src/controllers/chapter.controller');

// ══════════════════════════════════════════════════════════════
// CHAPTER ENDPOINT HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/chapter — chapter images + navigation ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { slug, chapter } = req.query;

    if (!slug || !chapter) {
      return res.status(400).json({
        success: false,
        error: 'Usage: /api/chapter?slug={manga-slug}&chapter={chapter-slug}',
      });
    }

    const result = await getChapterImages(slug, chapter);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: chapter.js
