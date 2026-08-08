import { sql } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';
import { withErrorHandling } from './_lib/handler.js';

// Handles both /api/gallery (list/create) and, via ?id=, single-item
// update/delete — kept in one file to stay under Vercel's function-count
// limit on the Hobby plan.
async function galleryHandler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET' && !id) {
    const rows = await sql`SELECT id, image_url, alt_text, sort_order FROM gallery ORDER BY sort_order ASC, created_at ASC`;
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const { image_url, alt_text } = req.body || {};
    if (!image_url || !String(image_url).trim()) {
      return res.status(400).json({ error: 'Image URL is required.' });
    }

    const maxRow = await sql`SELECT COALESCE(MAX(sort_order), 0) AS max FROM gallery`;
    const nextOrder = Number(maxRow[0].max) + 1;

    const rows = await sql`
      INSERT INTO gallery (image_url, alt_text, sort_order)
      VALUES (${String(image_url).trim()}, ${alt_text ? String(alt_text).trim() : ''}, ${nextOrder})
      RETURNING id, image_url, alt_text, sort_order
    `;
    return res.status(201).json(rows[0]);
  }

  if (id && req.method === 'PATCH') {
    const session = requireAdmin(req, res);
    if (!session) return;

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

  if (id && req.method === 'DELETE') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const rows = await sql`DELETE FROM gallery WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandling(galleryHandler);
