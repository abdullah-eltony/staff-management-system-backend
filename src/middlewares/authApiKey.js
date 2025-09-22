// middleware/authApiKey.js
const pool = require('../db');

const authApiKey = async (req, res, next) => {
  try {
    // extrack API key from headers
    const apiKey = req.headers['x-api-key']; 

    // check if API key exists
    if (!apiKey) {
      return res.status(401).json({ message: 'API key missing' });
    }

    const query = 'SELECT * FROM api_keys WHERE api_key = $1';
    const result = await pool.query(query, [apiKey]);

    // check if API key is valid
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // store user info in request object for further use
    req.user = { intern_id: result.rows[0].intern_id };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authApiKey;
