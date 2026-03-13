const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const getContent = () => request('/api/content');

export const updateSection = (section, data, token) =>
  request(`/api/content/${section}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const login = (username, password) =>
  request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

export const trackEvent = (type, key) =>
  fetch(`${BASE}/api/metrics/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, key }),
  }).catch(() => {}); // fire-and-forget, never block UI

export const getMetrics = (token) =>
  request('/api/metrics', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const resetMetrics = (token) =>
  request('/api/metrics/reset', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
