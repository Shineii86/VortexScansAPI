/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — home.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for the home page endpoint. Aggregates multiple
 *   parallel API requests for latest, hot, and top rated manga,
 *   along with genre metadata extraction.
 *
 * @exports
 *   getHome
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_API } = require('../helpers/constants.helper');
const { transformPost } = require('../extractors/manga.extractor');

// ══════════════════════════════════════════════════════════════
// HOME DATA AGGREGATION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Aggregate home page data from multiple endpoints ----
/**
 * Fetches and aggregates home page data from three parallel API calls:
 * - Latest manga (sorted by last chapter added)
 * - Hot/trending manga
 * - Top rated manga (sorted by average rating)
 *
 * Also extracts unique genres across all results for genre filtering.
 *
 * @returns {Promise<object>} Home page data with latest, hot, topRated, genres, stats
 *
 * @example
 *   const home = await getHome();
 *   // { success: true, data: { latest: [...], hot: [...], topRated: [...], genres: [...] } }
 */
const getHome = async () => {
  const cacheKey = 'home:data';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // NOTE: Parallel requests — fetch all three collections simultaneously
  const [latestRes, hotRes, topRatedRes] = await Promise.all([
    fetch(`${VORTEX_API}?page=1&perPage=20&view=archive&orderBy=lastChapterAddedAt&orderDirection=desc`),
    fetch(`${VORTEX_API}?page=1&perPage=10&view=archive&hot=true`),
    fetch(`${VORTEX_API}?page=1&perPage=10&view=archive&orderBy=averageRating&orderDirection=desc`),
  ]);

  const [latest, hot, topRated] = await Promise.all([
    latestRes.json(),
    hotRes.json(),
    topRatedRes.json(),
  ]);

  // NOTE: Extract unique genres across all manga results
  const genres = new Set();
  for (const post of [...(latest.posts || []), ...(hot.posts || [])]) {
    for (const g of post.genres || []) {
      genres.add(JSON.stringify({ id: g.id, name: g.name }));
    }
  }

  const result = {
    success: true,
    data: {
      latest: (latest.posts || []).map(transformPost),
      hot: (hot.posts || []).map(transformPost),
      topRated: (topRated.posts || []).map(transformPost),
      genres: [...genres].map((g) => JSON.parse(g)).sort((a, b) => a.name.localeCompare(b.name)),
      stats: {
        totalManga: latest.totalCount || 0,
      },
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.MANGA_LIST);
  return result;
};

module.exports = { getHome };

// ══════════════════════════════════════════════════════════════ END: home.controller.js
