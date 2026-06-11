export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.json({
    name: 'VortexScans API',
    version: '1.1.0',
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
    links: {
      github: 'https://github.com/Shineii86/VortexScansAPI',
      source: 'https://vortexscans.org',
    },
  });
}
