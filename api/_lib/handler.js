// Wraps an API route so any unexpected throw (DB hiccup, bad input we
// didn't anticipate, a third-party lib error) always ends in a clean JSON
// error response instead of the platform's generic failure page — no route
// should ever be able to take down its own request ungracefully.
export function withErrorHandling(handler) {
  return async function wrapped(req, res) {
    try {
      return await handler(req, res);
    } catch (err) {
      console.error(`Unhandled error in ${req.method} ${req.url}:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Something went wrong on our end. Please try again in a moment.' });
      }
    }
  };
}
