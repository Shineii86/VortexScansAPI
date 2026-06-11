/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — genres.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for genre listing.
 *   Aggregates all unique genres across multiple pages of manga
 *   data from the Vortex Scans API.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { getGenres } = require('../src/controllers/genre.controller');

// ══════════════════════════════════════════════════════════════
// GENRES ENDPOINT HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/genres — all available genres ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const result = await getGenres();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: genres.js
