import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  return res.status(200).json({ username: session.username });
}
