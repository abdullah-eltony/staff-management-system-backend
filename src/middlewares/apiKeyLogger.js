
import pool from '../db.js';

const apiKeyLogger = async (req, res, next) => {
  let apikey;
  try {
    // extract API key from headers
    console.log(req.headers)
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
    const intern_id = result.rows[0].intern_id;
    req.intern = {intern_id,apikey} ;


    const endpoint = req.originalUrl;
    const method = req.method;

    // log the API request
    await pool.query(
      'INSERT INTO api_logs (intern_id, endpoint, method) VALUES ($1, $2, $3)',
      [intern_id, endpoint, method]
    );

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default apiKeyLogger;
