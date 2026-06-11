/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — filter.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for advanced manga filtering.
 *   Supports filtering by series type, status, and genre with
 *   configurable sort order and pagination.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { filterManga } = require('../src/controllers/filter.controller');

// ══════════════════════════════════════════════════════════════
// FILTER ENDPOINT HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/filter — advanced manga filter ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const result = await filterManga(req.query);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: filter.js
