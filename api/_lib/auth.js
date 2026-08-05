import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'ssw_admin_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

function serializeCookie(name, value, { httpOnly, secure, sameSite, path, maxAge }) {
  let str = `${name}=${encodeURIComponent(value)}`;
  if (path) str += `; Path=${path}`;
  if (typeof maxAge === 'number') str += `; Max-Age=${maxAge}`;
  if (sameSite) str += `; SameSite=${sameSite}`;
  if (httpOnly) str += '; HttpOnly';
  if (secure) str += '; Secure';
  return str;
}

function parseCookies(header) {
  const out = {};
  String(header || '')
    .split(';')
    .forEach((part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return;
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      if (key) out[key] = decodeURIComponent(val);
    });
  return out;
}

export function signSession(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
}

export function setSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: MAX_AGE,
    })
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 0,
    })
  );
}

export function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

/** Call at the top of any admin-only handler. Returns the session, or null
 *  after already sending a 401 response — the caller should just `return`. */
export function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  return session;
}
