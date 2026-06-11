const { getChapterImages } = require('../src/controllers/chapter.controller');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { slug, chapter } = req.query;

    if (!slug || !chapter) {
      return res.status(400).json({
        success: false,
        error: 'Usage: /api/chapter?slug={manga-slug}&chapter={chapter-slug}',
      });
    }

    const result = await getChapterImages(slug, chapter);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
