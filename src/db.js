
import { Pool } from 'pg';
import config from './config/config.js';

const pool = new Pool(config.db);

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
