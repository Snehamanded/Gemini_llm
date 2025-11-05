import dotenv from 'dotenv';
import { getPool, ensureSchema } from '../src/db.js';

dotenv.config();

async function main() {
  console.log('Testing Postgres connection...');

  const pool = getPool();
  if (!pool) {
    console.error('Postgres not configured. Set PGHOST/PGDATABASE/PGUSER/PGPASSWORD or DATABASE_URL');
    process.exit(1);
  }

  try {
    // Ensure schema exists (idempotent)
    await ensureSchema();

    const { rows } = await pool.query('select now() as now, version() as version');
    console.log('Connection OK');
    console.log('Server time:', rows[0].now);
    console.log('Version:', rows[0].version);

    // Basic permission sanity: attempt a trivial select on cars
    try {
      const r = await pool.query('select count(*)::int as count from cars');
      console.log('cars table count:', r.rows[0].count);
    } catch (e) {
      console.warn('Warning: cannot query cars table:', e.message);
    }
    process.exit(0);
  } catch (e) {
    console.error('DB test failed:', e.message || e);
    process.exit(1);
  } finally {
    try { await pool.end(); } catch (_) {}
  }
}

main();


