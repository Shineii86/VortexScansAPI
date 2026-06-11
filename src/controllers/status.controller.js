const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');

async function getStatus() {
  const cacheKey = 'status:all';

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = {
    success: true,
    data: {
      statuses: [
        { id: 'ongoing', name: 'Ongoing' },
        { id: 'hiatus', name: 'Hiatus' },
        { id: 'completed', name: 'Completed' },
      ],
      types: [
        { id: 'manhwa', name: 'Manhwa' },
        { id: 'manga', name: 'Manga' },
        { id: 'manhua', name: 'Manhua' },
      ],
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.STATUS);
  return result;
}

module.exports = { getStatus };
