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
 *   CACHE_TTL, VORTEX_API, VORTEX_POSTS, VORTEX_CHAPTERS,
 *   VORTEX_CHAPTER, VORTEX_GENRES, VORTEX_COLLECTIONS,
 *   VORTEX_TEAMS, VORTEX_SITE
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// CACHE TIME-TO-LIVE CONFIGURATION
// ══════════════════════════════════════════════════════════════

const CACHE_TTL = {
  MANGA_LIST: 5 * 60 * 1000,
  MANGA_DETAIL: 5 * 60 * 1000,
  CHAPTER: 30 * 60 * 1000,
  GENRES: 60 * 60 * 1000,
  COLLECTIONS: 30 * 60 * 1000,
  TEAMS: 30 * 60 * 1000,
  HOME: 5 * 60 * 1000,
};

// ══════════════════════════════════════════════════════════════
// UPSTREAM API BASE URLS
// ══════════════════════════════════════════════════════════════

const VORTEX_API = 'https://api.vortexscans.org/api/query';
const VORTEX_POSTS = 'https://api.vortexscans.org/api/posts';
const VORTEX_CHAPTERS = 'https://api.vortexscans.org/api/chapters';
const VORTEX_CHAPTER = 'https://api.vortexscans.org/api/chapter';
const VORTEX_GENRES = 'https://api.vortexscans.org/api/genres';
const VORTEX_COLLECTIONS = 'https://api.vortexscans.org/api/collections';
const VORTEX_TEAMS = 'https://api.vortexscans.org/api/teams';
const VORTEX_SITE = 'https://vortexscans.org';

module.exports = {
  CACHE_TTL,
  VORTEX_API,
  VORTEX_POSTS,
  VORTEX_CHAPTERS,
  VORTEX_CHAPTER,
  VORTEX_GENRES,
  VORTEX_COLLECTIONS,
  VORTEX_TEAMS,
  VORTEX_SITE,
};

// ══════════════════════════════════════════════════════════════ END: constants.helper.js
