import { getPool } from './db.js';

const inMemory = new Map();

export async function appendTurn(userId, role, content) {
  const pool = getPool();
  if (pool) {
    try {
      await pool.query(
        'insert into conversation_history(user_id, role, content) values($1,$2,$3)',
        [userId, role, content]
      );
      return;
    } catch (_) {}
  }
  if (!inMemory.has(userId)) inMemory.set(userId, []);
  inMemory.get(userId).push({ role, content, created_at: new Date() });
}

export async function fetchRecentHistory(userId, limit = 20) {
  const pool = getPool();
  if (pool) {
    try {
      const { rows } = await pool.query(
        'select role, content, created_at from conversation_history where user_id=$1 order by created_at desc limit $2',
        [userId, limit]
      );
      return rows.reverse();
    } catch (_) {}
  }
  const arr = inMemory.get(userId) || [];
  return arr.slice(-limit);
}


