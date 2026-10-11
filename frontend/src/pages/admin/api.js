export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
export class ApiError extends Error {
  constructor(status, data) {
    const detail = data?.detail;
    const message = typeof detail === 'string' ? detail : Array.isArray(detail) ? detail.map(e => `${e.field || e.loc?.slice(1).join('.') || ''}: ${e.message || e.msg}`).join('; ') : data?.error?.message;
    super(message || (status === 0 ? 'Unable to reach the server. Please try again.' : `Request failed (${status})`));
    this.status = status; this.data = data;
  }
}
export async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  const token = path.startsWith('/api/admin') || path === '/api/service/info' ? sessionStorage.getItem('gw_admin_token') : null;
  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, credentials: 'include', signal: controller.signal, headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401 && path !== '/api/admin/login') { sessionStorage.removeItem('gw_admin_token'); window.dispatchEvent(new Event('gw-session-expired')); }
      throw new ApiError(res.status, data);
    }
    if (res.ok && options.method && !['GET', 'HEAD'].includes(options.method) &&
        (path.startsWith('/api/admin/content/') || path === '/api/admin/site-settings')) {
      try { localStorage.setItem('gw_cms_updated', String(Date.now())); } catch { /* Storage may be unavailable. */ }
      window.dispatchEvent(new Event('gw-cms-updated'));
    }
    return data;
  } catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(0, null); }
  finally { clearTimeout(timer); }
}
const api = {
  get: path => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: path => request(path, { method: 'DELETE' }),
};
export default api;
