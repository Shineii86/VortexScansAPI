const { searchManga } = require('../src/controllers/search.controller');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const result = await searchManga(req.query);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
