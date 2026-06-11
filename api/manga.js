/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — manga.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for manga endpoints.
 *   Supports listing, detail view, and chapter retrieval for
 *   individual manga series with pagination.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { getMangaList, getMangaBySlug, getMangaChapters } = require('../src/controllers/manga.controller');

// ══════════════════════════════════════════════════════════════
// MANGA ENDPOINT HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/manga — list, detail, or chapters ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { slug, action } = req.query;

    // NOTE: Chapters endpoint — /api/manga?slug={slug}&action=chapters
    if (slug && action === 'chapters') {
      const result = await getMangaChapters(slug, req.query);
      return res.status(result.status || 200).json(result);
    }

    // NOTE: Detail endpoint — /api/manga?slug={slug}
    if (slug) {
      const result = await getMangaBySlug(slug, req.query);
      return res.status(result.status || 200).json(result);
    }

    // NOTE: List endpoint — /api/manga
    const result = await getMangaList(req.query);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: manga.js
