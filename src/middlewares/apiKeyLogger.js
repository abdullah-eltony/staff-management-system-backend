
import pool from '../db.js';

const apiKeyLogger = async (req, res, next) => {
  let apikey;
  try {
    apikey = req.headers['x-api-key']; 

    // check if API key exists
    if (!apikey) {
      return res.status(401).json({ message: 'API key missing' });
    }

    const query = 'SELECT * FROM api_keys WHERE api_key = $1';
    const result = await pool.query(query, [apikey]);

    // check if API key is valid
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // store user info in request object
    const intern_id = result.rows[0].api_key_id;
    req.intern = {intern_id,apikey} ;


    const endpoint = req.originalUrl;
    const method = req.method;
    
    // log the API request
    await pool.query(
  'INSERT INTO api_logs (api_key_id, api_key, endpoint, method) VALUES ($1, $2, $3, $4)',
  [intern_id, apikey, endpoint, method]
);

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default apiKeyLogger;
