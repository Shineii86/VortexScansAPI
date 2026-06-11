/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — index.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for the API info endpoint.
 *   Returns comprehensive API documentation including all available
 *   endpoints, parameters, cache settings, and links.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { getApiInfo } = require('../src/controllers/info.controller');

// ══════════════════════════════════════════════════════════════
// API INFO HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api — API information and documentation ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const result = await getApiInfo();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: index.js
