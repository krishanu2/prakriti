import { requireAdmin } from '../_lib/auth.js';
import { withErrorHandling } from '../_lib/handler.js';

async function meHandler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  return res.status(200).json({ username: session.username });
}

export default withErrorHandling(meHandler);
