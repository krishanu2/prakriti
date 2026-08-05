import { sql } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'GET' && !id) {
    const rows = await sql`SELECT id, name, email, phone, message, status, created_at FROM leads ORDER BY created_at DESC`;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(rows);
  }

  if (id && req.method === 'PATCH') {
    const { status } = req.body || {};
    if (!['new', 'contacted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    const rows = await sql`UPDATE leads SET status = ${status} WHERE id = ${id} RETURNING id, status`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (id && req.method === 'DELETE') {
    // Deleting a lead frees up their email/phone so they can submit a new
    // enquiry — this is the intended way to "reset" someone, by design.
    const rows = await sql`DELETE FROM leads WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
