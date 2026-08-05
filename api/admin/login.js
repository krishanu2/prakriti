import bcrypt from 'bcryptjs';
import { signSession, setSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Enter your username and password.' });
  }

  if (String(username).trim() !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }

  const ok = await bcrypt.compare(String(password), process.env.ADMIN_PASSWORD_HASH);
  if (!ok) {
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }

  const token = signSession(String(username).trim());
  setSessionCookie(res, token);
  return res.status(200).json({ success: true });
}
