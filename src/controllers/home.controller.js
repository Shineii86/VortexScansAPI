const cache = require('../helpers/cache.helper');
const { CACHE_TTL, VORTEX_API } = require('../helpers/constants.helper');
const { transformPost } = require('../extractors/manga.extractor');

async function getHome() {
  const cacheKey = 'home:data';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

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
}

module.exports = { getHome };
