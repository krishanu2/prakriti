import bcrypt from 'bcryptjs';
import { sql } from '../_lib/db.js';
import { signSession, setSessionCookie } from '../_lib/auth.js';

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const LOCKOUT_MINUTES = 15;

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = clientIp(req);

  // Locked out? Tell them plainly, don't even touch the password.
  const [existing] = await sql`SELECT attempts, window_started_at, locked_until FROM login_attempts WHERE ip = ${ip}`;
  if (existing?.locked_until && new Date(existing.locked_until) > new Date()) {
    const minutesLeft = Math.ceil((new Date(existing.locked_until) - new Date()) / 60000);
    return res.status(429).json({ error: `Too many attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.` });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Enter your username and password.' });
  }

  const usernameOk = String(username).trim() === process.env.ADMIN_USERNAME;
  // Always run bcrypt, even on a wrong username, so response timing can't
  // be used to tell a valid username from an invalid one.
  const passwordOk = await bcrypt.compare(String(password), process.env.ADMIN_PASSWORD_HASH);

  if (!usernameOk || !passwordOk) {
    const windowExpired = !existing || new Date(existing.window_started_at) < new Date(Date.now() - WINDOW_MINUTES * 60000);
    const nextAttempts = windowExpired ? 1 : (existing.attempts || 0) + 1;
    const lockedUntil = nextAttempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MINUTES * 60000) : null;

    await sql`
      INSERT INTO login_attempts (ip, attempts, window_started_at, locked_until)
      VALUES (${ip}, ${nextAttempts}, ${windowExpired ? new Date() : existing.window_started_at}, ${lockedUntil})
      ON CONFLICT (ip) DO UPDATE SET
        attempts = ${nextAttempts},
        window_started_at = ${windowExpired ? new Date() : existing.window_started_at},
        locked_until = ${lockedUntil}
    `;

    if (lockedUntil) {
      return res.status(429).json({ error: `Too many attempts. Try again in ${LOCKOUT_MINUTES} minutes.` });
    }
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }

  // Success — clear this IP's attempt history.
  await sql`DELETE FROM login_attempts WHERE ip = ${ip}`;

  const token = signSession(String(username).trim());
  setSessionCookie(res, token);
  return res.status(200).json({ success: true });
}
