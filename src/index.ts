import fs from 'fs';
import path from 'path';
import app from './app';
import pool from './config/db';

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  const sql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf-8');
  await pool.query(sql);
  console.log('[DB] Schema initialized');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('[DB] Failed to initialize schema:', err);
  process.exit(1);
});
