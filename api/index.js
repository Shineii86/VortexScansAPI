const { getApiInfo } = require('../src/controllers/info.controller');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const result = await getApiInfo();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
