import { sql } from './_lib/db.js';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// Keeps the last 10 digits so +91, 0-prefixed, and spaced/dashed numbers
// all collapse to the same identity.
function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.slice(-10);
}

const ALREADY_SUBMITTED_MESSAGE =
  "Looks like we already have your details on file — Prakriti will reach out soon! If this seems wrong, message @staystrongstaywild on Instagram.";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body || {};

  const trimmedName = String(name || '').trim();
  if (!trimmedName) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }

  const trimmedEmail = String(email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const normPhone = normalizePhone(phone);
  if (normPhone.length !== 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
  }
  const trimmedPhone = String(phone || '').trim();

  const normEmail = normalizeEmail(trimmedEmail);

  try {
    const existing = await sql`
      SELECT id FROM leads
      WHERE normalized_email = ${normEmail} OR normalized_phone = ${normPhone}
      LIMIT 1
    `;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'ALREADY_SUBMITTED', message: ALREADY_SUBMITTED_MESSAGE });
    }

    await sql`
      INSERT INTO leads (name, email, phone, message, normalized_email, normalized_phone)
      VALUES (${trimmedName}, ${trimmedEmail}, ${trimmedPhone}, ${message ? String(message).trim() : null}, ${normEmail}, ${normPhone})
    `;

    return res.status(201).json({ success: true });
  } catch (err) {
    if (String(err.message || '').includes('duplicate key')) {
      return res.status(409).json({ error: 'ALREADY_SUBMITTED', message: ALREADY_SUBMITTED_MESSAGE });
    }
    console.error('leads POST error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again in a moment.' });
  }
}
