import { handleUpload } from '@vercel/blob/client';
import { getSession } from '../_lib/auth.js';

// Client-upload handshake: the browser asks this endpoint for a short-lived
// token (checked against the admin session below), then uploads the file
// straight to Vercel Blob — the file itself never passes through our
// serverless function, so there's no body-size limit to worry about.
export default async function handler(req, res) {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        const session = getSession(req);
        if (!session) {
          throw new Error('Not authenticated');
        }
        return {
          allowedContentTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
          addRandomSuffix: true,
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
        };
      },
      onUploadCompleted: async () => {
        // No server-side bookkeeping needed — the admin UI saves the
        // resulting URL onto the gallery/testimonial row itself.
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Upload failed.' });
  }
}
