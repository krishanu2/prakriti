import { sql } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const rows = await sql`SELECT id, name, context, quote, avatar_url, sort_order FROM testimonials ORDER BY sort_order ASC, created_at ASC`;
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const { name, context, quote, avatar_url } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: "Client name is required." });
    if (!quote || !String(quote).trim()) return res.status(400).json({ error: 'The testimonial text is required.' });

    const maxRow = await sql`SELECT COALESCE(MAX(sort_order), 0) AS max FROM testimonials`;
    const nextOrder = Number(maxRow[0].max) + 1;

    const rows = await sql`
      INSERT INTO testimonials (name, context, quote, avatar_url, sort_order)
      VALUES (${String(name).trim()}, ${context ? String(context).trim() : ''}, ${String(quote).trim()}, ${avatar_url ? String(avatar_url).trim() : ''}, ${nextOrder})
      RETURNING id, name, context, quote, avatar_url, sort_order
    `;
    return res.status(201).json(rows[0]);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
