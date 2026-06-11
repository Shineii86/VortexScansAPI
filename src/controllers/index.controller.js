const cache = require('../helpers/cache.helper');

async function getApiInfo() {
  const cacheKey = 'api:info';

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = {
    success: true,
    name: 'VortexScans API',
    version: '2.0.0',
    description: 'Unofficial REST API for Vortex Scans (vortexscans.org)',
    author: 'Shineii86',
    endpoints: {
      manga: {
        list: {
          url: '/api/manga',
          method: 'GET',
          params: {
            page: { type: 'number', default: 1 },
            limit: { type: 'number', default: 48 },
            search: { type: 'string' },
            type: { type: 'string', options: ['manhwa', 'manga', 'manhua'] },
            status: { type: 'string', options: ['ongoing', 'hiatus', 'completed'] },
            genre: { type: 'string' },
            order: { type: 'string' },
            direction: { type: 'string', options: ['asc', 'desc'] },
            hot: { type: 'boolean' },
          },
          example: '/api/manga?page=1&limit=20&type=manhwa',
        },
        detail: {
          url: '/api/manga/{slug}',
          method: 'GET',
          example: '/api/manga/reality-quest-2',
        },
      },
      genres: { url: '/api/genres', method: 'GET' },
      status: { url: '/api/status', method: 'GET' },
    },
    cache: {
      manga: '5 minutes',
      genres: '1 hour',
      status: '24 hours',
    },
    links: {
      github: 'https://github.com/Shineii86/VortexScansAPI',
      source: 'https://vortexscans.org',
    },
  };

  cache.set(cacheKey, result, 60 * 60 * 1000);
  return result;
}

module.exports = { getApiInfo };
