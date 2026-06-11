const { VORTEX_API } = require('../helpers/constants.helper');

async function fetchVortex(params = {}) {
  const defaults = {
    page: 1,
    perPage: 48,
    view: 'archive',
    orderBy: 'lastChapterAddedAt',
    orderDirection: 'desc',
  };

  const searchParams = new URLSearchParams({ ...defaults, ...params });
  const response = await fetch(`${VORTEX_API}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  return response.json();
}

module.exports = { fetchVortex };
