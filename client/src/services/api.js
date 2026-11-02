const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || 'Something went wrong. Please try again.');
  return payload.data;
}

export const api = {
  create: (body) => request('/mysteries', { method: 'POST', body: JSON.stringify(body) }),
  status: (id) => request('/mysteries/' + id + '/status'),
  mystery: (id) => request('/mysteries/' + id),
  evidence: (id) => request('/mysteries/' + id + '/evidence'),
  suspects: (id) => request('/mysteries/' + id + '/suspects'),
  timeline: (id) => request('/mysteries/' + id + '/timeline'),
  accuse: (id, body) => request('/mysteries/' + id + '/accusations', { method: 'POST', body: JSON.stringify(body) }),
  result: (id) => request('/mysteries/' + id + '/results'),
  retry: (id) => request('/mysteries/' + id + '/retry', { method: 'POST' }),
};
