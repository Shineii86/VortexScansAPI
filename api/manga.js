const { getMangaList, getMangaBySlug, getMangaChapters } = require('../src/controllers/manga.controller');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { slug, action } = req.query;

    if (slug && action === 'chapters') {
      const result = await getMangaChapters(slug, req.query);
      return res.status(result.status || 200).json(result);
    }

    if (slug) {
      const result = await getMangaBySlug(slug, req.query);
      return res.status(result.status || 200).json(result);
    }

    const result = await getMangaList(req.query);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
