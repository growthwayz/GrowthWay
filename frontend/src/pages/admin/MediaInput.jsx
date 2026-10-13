import { useState } from 'react';
import { uploadMedia, fileDescription } from './uploadMedia';
import { imageUrl } from './media';
import { videoUrl } from '../../lib/media';

export default function MediaInput({ label, kind, value, description = '', onUploaded, onChange, onPick, onBusy, dimensions = '' }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  async function choose(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true); onBusy?.(true); setProgress(0); setError('');
    try { onUploaded(await uploadMedia(file, kind, { alt: description || fileDescription(file), onProgress: setProgress })); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); onBusy?.(false); }
  }
  return <div className="admin-media-input">
    <strong>{label}</strong>
    {dimensions && (
      <div className="admin-media-dimensions-badge">
        <span className="admin-dim-icon">📐</span>
        <span className="admin-dim-text">{dimensions}</span>
      </div>
    )}
    {value && (kind === 'image' ? <img src={imageUrl(value, 640)} alt={description || 'Selected image'} /> : <video key={value} src={videoUrl(value)} controls preload="metadata" />)}
    <label className="admin-upload-label">{value ? `Upload replacement ${kind}` : `Upload ${kind}`}<input type="file" aria-label={`Upload ${label.toLowerCase()}`} accept={kind === 'image' ? '.jpg,.jpeg,.png,.webp,.gif,.avif' : '.mp4,.mov,.webm'} disabled={busy} onChange={choose} /></label>
    <small className="admin-muted">{kind === 'image' ? 'Up to 10 MB.' : 'Up to 100 MB.'} Upload, then save changes to apply it to the website.</small>
    {busy && <p role="status">{progress < 100 ? `Uploading… ${progress}%` : 'Verifying upload…'}</p>}
    {error && <p className="admin-error" role="alert">{error}</p>}
    <div className="admin-actions"><button type="button" className="secondary" onClick={onPick} disabled={busy}>Choose existing file</button>{value && <button type="button" className="secondary" disabled={busy} onClick={() => onChange('')}>Remove selection</button>}</div>
    <details><summary>Advanced: use a file URL</summary><label>File URL<input type="url" value={value || ''} disabled={busy} onChange={event => onChange(event.target.value)} /></label></details>
  </div>;
}
