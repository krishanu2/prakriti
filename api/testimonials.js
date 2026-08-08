import { sql } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';
import { withErrorHandling } from './_lib/handler.js';

async function testimonialsHandler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET' && !id) {
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

  if (id && req.method === 'PATCH') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const { name, context, quote, avatar_url, sort_order } = req.body || {};
    const rows = await sql`
      UPDATE testimonials SET
        name = COALESCE(${name ?? null}, name),
        context = COALESCE(${context ?? null}, context),
        quote = COALESCE(${quote ?? null}, quote),
        avatar_url = COALESCE(${avatar_url ?? null}, avatar_url),
        sort_order = COALESCE(${sort_order ?? null}, sort_order)
      WHERE id = ${id}
      RETURNING id, name, context, quote, avatar_url, sort_order
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (id && req.method === 'DELETE') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const rows = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandling(testimonialsHandler);
