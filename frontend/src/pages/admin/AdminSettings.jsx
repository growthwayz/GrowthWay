import { useEffect, useState } from 'react';
import api from './api';
import ContentEditor from './ContentEditor';
export default function AdminSettings() {
 const [data, setData] = useState(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [reload, setReload] = useState(0);
 useEffect(() => { setData(null); api.get('/api/admin/site-settings').then(setData).catch(err => setError(err.message)); }, [reload]);
 async function save(payload) { setError(''); setBusy(true); setMessage(''); try { const result = await api.put('/api/admin/site-settings', payload); setData(result); setMessage('Site settings saved.'); } catch (err) { setError(err.message); } finally { setBusy(false); } }
 return <section><h1>Site settings</h1><p>Contact details, homepage content, social links, SEO and analytics.</p><p className="admin-muted">Some public website sections still use fixed content and do not yet apply these settings.</p>{error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="admin-success" role="status">{message}</p>}<button className="secondary" onClick={() => { setError(''); setReload(v => v + 1); }}>Reload settings</button>{data ? <ContentEditor key={data.revision} collection="settings" record={data} onSave={save} busy={busy} /> : !error && <p>Loading…</p>}</section>;
}
