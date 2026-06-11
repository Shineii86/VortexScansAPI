/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — constants.helper.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Centralized constants for cache TTLs, API base URLs, and
 *   other configuration values. Single source of truth for all
 *   magic numbers and environment-specific settings.
 *
 * @exports
 *   CACHE_TTL, VORTEX_API, VORTEX_SITE
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// CACHE TIME-TO-LIVE CONFIGURATION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Per-endpoint cache TTL settings ----
/**
 * Cache TTL (Time-To-Live) configuration for different data types.
 * Manga lists/details use shorter TTLs since they update frequently.
 * Chapter images use longer TTLs since they rarely change.
 * Genres and status use longest TTLs since they're mostly static.
 *
 * @type {object}
 */
const CACHE_TTL = {
  MANGA_LIST: 5 * 60 * 1000,      // 5 minutes — manga lists update frequently
  MANGA_DETAIL: 5 * 60 * 1000,     // 5 minutes — detail data changes with chapters
  CHAPTER_IMAGES: 30 * 60 * 1000,  // 30 minutes — chapter images are immutable
  GENRES: 60 * 60 * 1000,          // 1 hour — genres rarely change
  STATUS: 24 * 60 * 60 * 1000,     // 24 hours — status types are static
};

// ══════════════════════════════════════════════════════════════
// API BASE URLS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Vortex Scans API endpoint ----
/**
 * Base URL for the Vortex Scans JSON API.
 * Used for manga listings, search, and metadata queries.
 *
 * @type {string}
 */
const VORTEX_API = 'https://api.vortexscans.org/api/query';

// ---- FEATURE: Vortex Scans website URL ----
/**
 * Base URL for the Vortex Scans website.
 * Used for chapter HTML scraping (image extraction).
 *
 * @type {string}
 */
const VORTEX_SITE = 'https://vortexscans.org';

module.exports = { CACHE_TTL, VORTEX_API, VORTEX_SITE };

// ══════════════════════════════════════════════════════════════ END: constants.helper.js
