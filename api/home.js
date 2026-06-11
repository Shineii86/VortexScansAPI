/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — home.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for home page data.
 *   Aggregates latest, hot, and top rated manga collections
 *   along with genre metadata from the Vortex Scans API.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { getHome } = require('../src/controllers/home.controller');

// ══════════════════════════════════════════════════════════════
// HOME ENDPOINT HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/home — home page data ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const result = await getHome();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: home.js
