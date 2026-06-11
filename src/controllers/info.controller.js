const cache = require('../helpers/cache.helper');

async function getApiInfo() {
  const cacheKey = 'api:info';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = {
    success: true,
    name: 'VortexScans API',
    version: '3.0.0',
    description: 'Unofficial REST API for Vortex Scans (vortexscans.org)',
    author: 'Shineii86',
    endpoints: {
      home: {
        url: '/api/home',
        method: 'GET',
        description: 'Home page data (latest, hot, top rated)',
      },
      manga: {
        list: {
          url: '/api/manga',
          method: 'GET',
          description: 'List all manga with pagination',
          params: {
            page: { type: 'number', default: 1 },
            limit: { type: 'number', default: 48, max: 100 },
            search: { type: 'string' },
            type: { type: 'string', options: ['manhwa', 'manga', 'manhua'] },
            status: { type: 'string', options: ['ongoing', 'hiatus', 'completed'] },
            genre: { type: 'string' },
            order: { type: 'string' },
            direction: { type: 'string', options: ['asc', 'desc'] },
            hot: { type: 'boolean' },
          },
        },
        detail: {
          url: '/api/manga/{slug}',
          method: 'GET',
          description: 'Manga detail with chapters',
        },
        chapters: {
          url: '/api/manga/{slug}/chapters',
          method: 'GET',
          description: 'All chapters for a manga',
        },
      },
      chapter: {
        images: {
          url: '/api/chapter/{slug}/{chapter}',
          method: 'GET',
          description: 'Chapter images + navigation',
        },
      },
      search: {
        url: '/api/search?q=keyword',
        method: 'GET',
        description: 'Search manga by keyword',
      },
      filter: {
        url: '/api/filter?type=manhwa&status=ongoing',
        method: 'GET',
        description: 'Filter manga by type/status/genre',
      },
      genres: {
        url: '/api/genres',
        method: 'GET',
        description: 'All available genres',
      },
      status: {
        url: '/api/status',
        method: 'GET',
        description: 'Available statuses, types, sort options',
      },
    },
    cache: {
      manga: '5 minutes',
      chapters: '5 minutes',
      chapterImages: '30 minutes',
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
