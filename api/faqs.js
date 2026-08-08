import { sql } from './_lib/db.js';
import { requireAdmin } from './_lib/auth.js';
import { withErrorHandling } from './_lib/handler.js';

async function faqsHandler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET' && !id) {
    const rows = await sql`SELECT id, question, answer, sort_order FROM faqs ORDER BY sort_order ASC, created_at ASC`;
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const { question, answer } = req.body || {};
    if (!question || !String(question).trim()) return res.status(400).json({ error: 'The question is required.' });
    if (!answer || !String(answer).trim()) return res.status(400).json({ error: 'The answer is required.' });

    const maxRow = await sql`SELECT COALESCE(MAX(sort_order), 0) AS max FROM faqs`;
    const nextOrder = Number(maxRow[0].max) + 1;

    const rows = await sql`
      INSERT INTO faqs (question, answer, sort_order)
      VALUES (${String(question).trim()}, ${String(answer).trim()}, ${nextOrder})
      RETURNING id, question, answer, sort_order
    `;
    return res.status(201).json(rows[0]);
  }

  if (id && req.method === 'PATCH') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const { question, answer, sort_order } = req.body || {};
    const rows = await sql`
      UPDATE faqs SET
        question = COALESCE(${question ?? null}, question),
        answer = COALESCE(${answer ?? null}, answer),
        sort_order = COALESCE(${sort_order ?? null}, sort_order)
      WHERE id = ${id}
      RETURNING id, question, answer, sort_order
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (id && req.method === 'DELETE') {
    const session = requireAdmin(req, res);
    if (!session) return;

    const rows = await sql`DELETE FROM faqs WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandling(faqsHandler);
