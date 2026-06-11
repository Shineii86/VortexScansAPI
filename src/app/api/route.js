export async function GET() {
  return Response.json({
    name: 'VortexScans API',
    version: '1.0.0',
    description: 'Unofficial REST API for Vortex Scans (vortexscans.org)',
    author: 'Shineii86',
    endpoints: {
      manga: {
        list: {
          url: '/api/manga',
          method: 'GET',
          description: 'Get a list of all manga/manhwa/manhua',
          params: {
            page: { type: 'number', default: 1, description: 'Page number' },
            limit: { type: 'number', default: 48, description: 'Items per page' },
            search: { type: 'string', description: 'Search by title' },
            type: { type: 'string', description: 'Filter by type (manhwa, manga, manhua)' },
            status: { type: 'string', description: 'Filter by status (ongoing, hiatus, completed)' },
            genre: { type: 'string', description: 'Filter by genre name' },
            order: { type: 'string', description: 'Sort field' },
            direction: { type: 'string', description: 'Sort direction (asc, desc)' },
            hot: { type: 'boolean', description: 'Filter hot series only' },
          },
          example: '/api/manga?page=1&limit=20&type=manhwa',
        },
        detail: {
          url: '/api/manga/{slug}',
          method: 'GET',
          description: 'Get detailed info about a specific manga',
          params: {
            page: { type: 'number', default: 1, description: 'Chapters page' },
            limit: { type: 'number', default: 50, description: 'Chapters per page' },
          },
          example: '/api/manga/reality-quest-2',
        },
      },
      genres: {
        url: '/api/genres',
        method: 'GET',
        description: 'Get all available genres',
        example: '/api/genres',
      },
      status: {
        url: '/api/status',
        method: 'GET',
        description: 'Get available statuses and types',
        example: '/api/status',
      },
    },
    links: {
      github: 'https://github.com/Shineii86/VortexScansAPI',
      source: 'https://vortexscans.org',
    },
  });
}
