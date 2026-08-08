import { clearSessionCookie } from '../_lib/auth.js';
import { withErrorHandling } from '../_lib/handler.js';

async function logoutHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  clearSessionCookie(res);
  return res.status(200).json({ success: true });
}

export default withErrorHandling(logoutHandler);
