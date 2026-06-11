const { getHome } = require('../src/controllers/home.controller');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const result = await getHome();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
