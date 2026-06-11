const CACHE_TTL = {
  MANGA_LIST: 5 * 60 * 1000,
  MANGA_DETAIL: 5 * 60 * 1000,
  CHAPTER_IMAGES: 30 * 60 * 1000,
  GENRES: 60 * 60 * 1000,
  STATUS: 24 * 60 * 60 * 1000,
};

const VORTEX_API = 'https://api.vortexscans.org/api/query';
const VORTEX_SITE = 'https://vortexscans.org';

module.exports = { CACHE_TTL, VORTEX_API, VORTEX_SITE };
