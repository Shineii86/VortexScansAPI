const VORTEX_API = 'https://api.vortexscans.org/api/query';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const genreMap = new Map();

    for (let page = 1; page <= 8; page++) {
      const response = await fetch(
        `${VORTEX_API}?page=${page}&perPage=100&view=archive&orderBy=lastChapterAddedAt&orderDirection=desc`
      );

      if (!response.ok) break;
      const data = await response.json();

      for (const post of data.posts || []) {
        for (const genre of post.genres || []) {
          if (!genreMap.has(genre.id)) {
            genreMap.set(genre.id, { id: genre.id, name: genre.name });
          }
        }
      }

      if ((data.posts || []).length < 100) break;
    }

    const genres = Array.from(genreMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    return res.json({ success: true, data: genres, total: genres.length });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
