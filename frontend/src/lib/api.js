/**
 * API client — thin wrapper over fetch using VITE_API_BASE_URL.
 * Every data-driven component uses this for consistency.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(status, data) {
    super(data?.error?.message || `API error ${status}`);
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      let data;
      try { data = await res.json(); } catch { data = null; }
      throw new ApiError(res.status, data);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Network error
    throw new ApiError(0, { error: { code: 'NETWORK_ERROR', message: 'Unable to reach the server.' } });
  }
}

const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export default api;
export { ApiError };
