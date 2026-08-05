import { upload } from '@vercel/blob/client';

// Thin fetch wrapper for the admin API. Every call includes cookies
// (same-origin session) and throws a friendly Error on failure so callers
// can just try/catch and show err.message.

async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = (data && data.error) || `Something went wrong (${res.status}).`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  login: (username, password) =>
    request('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/api/admin/logout', { method: 'POST' }),
  me: () => request('/api/admin/me'),

  // leads
  getLeads: () => request('/api/admin/leads'),
  updateLeadStatus: (id, status) =>
    request(`/api/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteLead: (id) => request(`/api/admin/leads/${id}`, { method: 'DELETE' }),

  // gallery
  getGallery: () => request('/api/gallery'),
  addGalleryImage: (payload) => request('/api/gallery', { method: 'POST', body: JSON.stringify(payload) }),
  updateGalleryImage: (id, payload) => request(`/api/gallery/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteGalleryImage: (id) => request(`/api/gallery/${id}`, { method: 'DELETE' }),

  // testimonials
  getTestimonials: () => request('/api/testimonials'),
  addTestimonial: (payload) => request('/api/testimonials', { method: 'POST', body: JSON.stringify(payload) }),
  updateTestimonial: (id, payload) => request(`/api/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTestimonial: (id) => request(`/api/testimonials/${id}`, { method: 'DELETE' }),

  // faqs
  getFaqs: () => request('/api/faqs'),
  addFaq: (payload) => request('/api/faqs', { method: 'POST', body: JSON.stringify(payload) }),
  updateFaq: (id, payload) => request(`/api/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteFaq: (id) => request(`/api/faqs/${id}`, { method: 'DELETE' }),

  // photo upload — uploads straight from the browser to storage and
  // returns a public URL to save onto a gallery/testimonial row.
  uploadPhoto: async (file) => {
    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/admin/upload',
    });
    return blob.url;
  },
};
