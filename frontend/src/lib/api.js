/**
 * API client — thin wrapper over fetch using VITE_API_BASE_URL.
 * Every data-driven component uses this for consistency.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(status, data) {
    super(data?.error?.message || (typeof data?.detail === 'string' ? data.detail : `API error ${status}`));
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const { timeoutMs = 15000, signal, ...fetchOptions } = options;
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, timeoutMs);
  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
      signal: controller.signal,
    });
    if (!res.ok) {
      let data;
      try { data = await res.json(); } catch { data = null; }
      throw new ApiError(res.status, data);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (controller.signal.aborted) throw new ApiError(0, { error: { code: 'TIMEOUT', message: 'The request took too long. Please try again.' } });
    // Network error
    throw new ApiError(0, { error: { code: 'NETWORK_ERROR', message: 'Unable to reach the server.' } });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export default api;
export { ApiError };
