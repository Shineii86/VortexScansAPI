/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — fetch.helper.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   HTTP fetch wrapper for the Vortex Scans API. Handles request
 *   construction, default parameters, and error handling for all
 *   API calls to the Vortex backend.
 *
 * @exports
 *   fetchVortex
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { VORTEX_API } = require('../helpers/constants.helper');

// ══════════════════════════════════════════════════════════════
// API FETCH WRAPPER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Vortex API fetch with default parameters ----
/**
 * Fetches data from the Vortex Scans API with default parameters.
 * Merges provided params with defaults (page=1, perPage=48, etc.)
 * and returns parsed JSON response.
 *
 * @param {object} params - Query parameters to merge with defaults
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.perPage=48] - Results per page (max 100)
 * @param {string} [params.view="archive"] - View mode
 * @param {string} [params.orderBy="lastChapterAddedAt"] - Sort field
 * @param {string} [params.orderDirection="desc"] - Sort direction
 * @returns {Promise<object>} Parsed JSON response from Vortex API
 * @throws {Error} If API response is not OK
 *
 * @example
 *   const data = await fetchVortex({ search: "naruto", perPage: 20 });
 */
const fetchVortex = async (params = {}) => {
  // NOTE: Default parameters — ensure consistent API behavior
  const defaults = {
    page: 1,
    perPage: 48,
    view: 'archive',
    orderBy: 'lastChapterAddedAt',
    orderDirection: 'desc',
  };

  const searchParams = new URLSearchParams({ ...defaults, ...params });
  const response = await fetch(`${VORTEX_API}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  return response.json();
};

module.exports = { fetchVortex };

// ══════════════════════════════════════════════════════════════ END: fetch.helper.js
