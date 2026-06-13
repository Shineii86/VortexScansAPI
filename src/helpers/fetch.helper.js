/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — fetch.helper.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   HTTP fetch wrappers for all Vortex Scans upstream API endpoints.
 *   Handles request construction, default parameters, and error handling.
 *
 * @exports
 *   fetchQuery, fetchPosts, fetchChapters, fetchChapter,
 *   fetchGenres, fetchCollections, fetchCollectionDetail, fetchTeams
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const {
  VORTEX_API, VORTEX_POSTS, VORTEX_CHAPTERS, VORTEX_CHAPTER,
  VORTEX_GENRES, VORTEX_COLLECTIONS, VORTEX_TEAMS,
} = require('../helpers/constants.helper');

// ══════════════════════════════════════════════════════════════
// QUERY / POSTS
// ══════════════════════════════════════════════════════════════

const fetchQuery = async (params = {}) => {
  const defaults = { page: 1, perPage: 48, view: 'archive', orderBy: 'lastChapterAddedAt', orderDirection: 'desc' };
  const searchParams = new URLSearchParams({ ...defaults, ...params });
  const response = await fetch(`${VORTEX_API}?${searchParams}`);
  if (!response.ok) throw new Error(`Vortex query error: ${response.status}`);
  return response.json();
};

const fetchPosts = async (params = {}) => {
  const defaults = { page: 1, perPage: 48 };
  const searchParams = new URLSearchParams({ ...defaults, ...params });
  const response = await fetch(`${VORTEX_POSTS}?${searchParams}`);
  if (!response.ok) throw new Error(`Vortex posts error: ${response.status}`);
  return response.json();
};

// ══════════════════════════════════════════════════════════════
// CHAPTERS
// ══════════════════════════════════════════════════════════════

const fetchChapters = async (postId) => {
  const searchParams = new URLSearchParams({ postId });
  const response = await fetch(`${VORTEX_CHAPTERS}?${searchParams}`);
  if (!response.ok) throw new Error(`Vortex chapters error: ${response.status}`);
  return response.json();
};

const fetchChapter = async (chapterId) => {
  const searchParams = new URLSearchParams({ chapterId });
  const response = await fetch(`${VORTEX_CHAPTER}?${searchParams}`);
  if (!response.ok) throw new Error(`Vortex chapter error: ${response.status}`);
  return response.json();
};

// ══════════════════════════════════════════════════════════════
// GENRES
// ══════════════════════════════════════════════════════════════

const fetchGenres = async () => {
  const response = await fetch(VORTEX_GENRES);
  if (!response.ok) throw new Error(`Vortex genres error: ${response.status}`);
  return response.json();
};

// ══════════════════════════════════════════════════════════════
// COLLECTIONS
// ══════════════════════════════════════════════════════════════

const fetchCollections = async () => {
  const response = await fetch(VORTEX_COLLECTIONS);
  if (!response.ok) throw new Error(`Vortex collections error: ${response.status}`);
  return response.json();
};

const fetchCollectionDetail = async (slug) => {
  const response = await fetch(`${VORTEX_COLLECTIONS}/${slug}`);
  if (!response.ok) throw new Error(`Vortex collection detail error: ${response.status}`);
  return response.json();
};

// ══════════════════════════════════════════════════════════════
// TEAMS
// ══════════════════════════════════════════════════════════════

const fetchTeams = async (params = {}) => {
  const defaults = { page: 1, perPage: 20 };
  const searchParams = new URLSearchParams({ ...defaults, ...params });
  const response = await fetch(`${VORTEX_TEAMS}?${searchParams}`);
  if (!response.ok) throw new Error(`Vortex teams error: ${response.status}`);
  return response.json();
};

module.exports = {
  fetchQuery, fetchPosts, fetchChapters, fetchChapter,
  fetchGenres, fetchCollections, fetchCollectionDetail, fetchTeams,
};

// ══════════════════════════════════════════════════════════════ END: fetch.helper.js
