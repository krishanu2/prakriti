import { sql } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const rows = await sql`SELECT id, name, email, phone, message, status, created_at FROM leads ORDER BY created_at DESC`;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(rows);
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).json({ error: 'Method not allowed' });
}
