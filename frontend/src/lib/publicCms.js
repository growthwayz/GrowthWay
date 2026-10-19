import { useEffect, useState } from 'react';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

// Keep open website tabs current after an admin save, on returning to the tab,
// and within 30 seconds for visitors on other devices.
export function usePublicCms(path) {
  const [state, setState] = useState({ path, data: null, loading: true, error: '' });
  useEffect(() => {
    let active = true;
    let controller;
    async function refresh() {
      controller?.abort();
      controller = new AbortController();
      const current = controller;
      const timer = setTimeout(() => current.abort(), 15000);
      try {
        const response = await fetch(`${BASE_URL}${path}`, { cache: 'no-store', signal: current.signal });
        if (!response.ok) {
          const error = new Error(response.status === 404 ? 'This project is no longer available.' : 'Unable to load website content.');
          error.status = response.status;
          throw error;
        }
        const data = await response.json();
        if (active && current === controller) setState({ path, data, loading: false, error: '' });
      } catch (error) {
        if (active && current === controller) {
          setState(previous => ({ path, data: error.status !== 404 && previous.path === path ? previous.data : null,
            loading: false, error: current.signal.aborted ? 'Website content took too long to load.' : error.message }));
        }
      } finally { clearTimeout(timer); }
    }
    const visibleRefresh = () => { if (!document.hidden) refresh(); };
    const changed = event => { if (!event.key || event.key === 'gw_cms_updated') visibleRefresh(); };
    refresh();
    const interval = setInterval(visibleRefresh, 30000);
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    window.addEventListener('storage', changed);
    window.addEventListener('gw-cms-updated', visibleRefresh);
    return () => {
      active = false; controller?.abort(); clearInterval(interval);
      window.removeEventListener('focus', visibleRefresh);
      document.removeEventListener('visibilitychange', visibleRefresh);
      window.removeEventListener('storage', changed);
      window.removeEventListener('gw-cms-updated', visibleRefresh);
    };
  }, [path]);
  return state.path === path ? state : { data: null, loading: true, error: '' };
}

export function portfolioProject(record, index, categories = [], services = []) {
  const categoryNames = Object.fromEntries(categories.map(item => [item.slug, item.name]));
  const serviceNames = Object.fromEntries(services.map(item => [item.slug, item.title]));
  return {
    ...record,
    id: String(index + 1).padStart(2, '0'),
    image: record.coverImage,
    imageAlt: record.coverImageAlt || record.title,
    categories: (record.categories || []).map(slug => categoryNames[slug] || slug),
    description: record.challenge,
    longDescription: record.strategy,
    composition: ['split', 'portrait', 'dark', 'typography'][Math.max(0, index - 1) % 4],
    stats: record.resultsVerified && record.results?.length
      ? Object.fromEntries(record.results.map(item => [item.label, item.value])) : null,
    metadata: { client: record.client, year: record.year, location: record.location,
      role: (record.services || []).map(slug => serviceNames[slug] || slug).join(' · ') },
  };
}
