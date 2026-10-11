import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from './api';
import MediaInput from './MediaInput';
import { MediaPicker } from './ContentEditor';

export default function AdminHero() {
  const admin = useOutletContext();
  const [settings, setSettings] = useState(null);
  const [picker, setPicker] = useState(null);
  const [uploads, setUploads] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    if (admin.role !== 'admin') return;
    let active = true;
    api.get('/api/admin/site-settings').then(data => { if (active) setSettings(data); }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [admin.role, reload]);
  if (admin.role !== 'admin') return <p>Ask an administrator to update the homepage video.</p>;
  function change(key, value) { setMessage(''); setSettings(previous => ({ ...previous, hero: { ...previous.hero, [key]: value } })); }
  function select(key, item) { setSettings(previous => ({ ...previous, hero: { ...previous.hero, [key]: item.url,
    ...(key === 'poster' ? { posterAlt: item.alt } : {}) } })); setMessage(''); }
  async function save(event) {
    event.preventDefault(); if (uploads || busy) return;
    setBusy(true); setError(''); setMessage('');
    try { setSettings(await api.put('/api/admin/site-settings', settings)); setMessage('Homepage video saved. The website now uses this selection.'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section><h1>Homepage video</h1><p>Upload a video, confirm that you have permission to use it, and save. Both homepage video areas update together.</p>
    {error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="admin-success" role="status">{message}</p>}
    <button type="button" className="secondary" disabled={busy || uploads > 0} onClick={() => { setError(''); setSettings(null); setReload(count => count + 1); }}>Reload saved version</button>
    {!settings ? !error && <p>Loading…</p> : <form className="admin-editor" onSubmit={save}>
      <fieldset className="admin-grid admin-fields" disabled={busy || uploads > 0}>
        <MediaInput label="Homepage video" kind="video" value={settings.hero.videoUrl} onUploaded={item => select('videoUrl', item)} onChange={value => change('videoUrl', value)} onPick={() => setPicker('videoUrl')} onBusy={value => setUploads(count => count + (value ? 1 : -1))} />
        <MediaInput label="Video poster (optional)" kind="image" value={settings.hero.poster} description={settings.hero.posterAlt} onUploaded={item => select('poster', item)} onChange={value => change('poster', value)} onPick={() => setPicker('poster')} onBusy={value => setUploads(count => count + (value ? 1 : -1))} />
        <label>Poster description<input value={settings.hero.posterAlt} onChange={event => change('posterAlt', event.target.value)} required={!!settings.hero.poster} maxLength={240} /></label>
        {settings.hero.videoUrl && <label className="check"><input type="checkbox" checked={settings.hero.videoPermissionApproved} onChange={event => change('videoPermissionApproved', event.target.checked)} required />We have permission to use all footage in this video.</label>}
      </fieldset>
      <div className="admin-actions"><button disabled={busy || uploads > 0}>{uploads ? 'Uploading…' : busy ? 'Saving…' : 'Save homepage video'}</button><button type="button" className="secondary" disabled={busy || uploads > 0} onClick={() => { change('videoUrl', ''); change('poster', ''); change('posterAlt', ''); change('videoPermissionApproved', false); }}>Use original video</button><a href="/" target="_blank" rel="noreferrer">View homepage ↗</a></div>
    </form>}
    {picker && <MediaPicker kind={picker === 'videoUrl' ? 'video' : 'image'} onSelect={item => { select(picker, item); setPicker(null); }} onClose={() => setPicker(null)} />}
  </section>;
}
