/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — search.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for manga search.
 *   Performs full-text search against the Vortex Scans API
 *   with pagination and sorting options.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { searchManga } = require('../src/controllers/search.controller');

// ══════════════════════════════════════════════════════════════
// SEARCH ENDPOINT HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/search — full-text manga search ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const result = await searchManga(req.query);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: search.js
