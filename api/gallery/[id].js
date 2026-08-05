import { sql } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { image_url, alt_text, sort_order } = req.body || {};
    const rows = await sql`
      UPDATE gallery SET
        image_url = COALESCE(${image_url ?? null}, image_url),
        alt_text = COALESCE(${alt_text ?? null}, alt_text),
        sort_order = COALESCE(${sort_order ?? null}, sort_order)
      WHERE id = ${id}
      RETURNING id, image_url, alt_text, sort_order
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (req.method === 'DELETE') {
    const rows = await sql`DELETE FROM gallery WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
