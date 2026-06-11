/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — status.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Vercel serverless function handler for status/types metadata.
 *   Returns available manga statuses, types, and sort options
 *   for use in filter endpoints.
 *
 * @exports
 *   module.exports - Vercel serverless handler function
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { getStatus } = require('../src/controllers/genre.controller');

// ══════════════════════════════════════════════════════════════
// STATUS ENDPOINT HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/status — statuses, types, sort options ----
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const result = await getStatus();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: status.js
