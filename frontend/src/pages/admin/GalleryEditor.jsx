import { useState } from 'react';
import { uploadMedia, fileDescription } from './uploadMedia';
import { imageUrl } from './media';

const keys = ['gallery', 'galleryAlts', 'galleryCaptions'];
export default function GalleryEditor({ data, setData, onBusy, onPick }) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function update(index, key, value) {
    setData(previous => ({ ...previous, [key]: previous.gallery.map((_, i) => i === index ? value : previous[key]?.[i] || '') }));
  }
  function move(index, delta) {
    setData(previous => {
      const next = { ...previous };
      for (const key of keys) {
        next[key] = previous.gallery.map((_, i) => previous[key]?.[i] || '');
        [next[key][index], next[key][index + delta]] = [next[key][index + delta], next[key][index]];
      }
      return next;
    });
  }
  function remove(index) {
    setData(previous => ({ ...previous, ...Object.fromEntries(keys.map(key => [key,
      previous.gallery.map((_, i) => previous[key]?.[i] || '').filter((_, i) => i !== index)])) }));
  }
  async function upload(event) {
    const files = [...event.target.files]; event.target.value = '';
    if (!files.length) return;
    onBusy(true); setError('');
    try {
      for (let index = 0; index < files.length; index++) {
        setMessage(`Uploading image ${index + 1} of ${files.length}…`);
        const item = await uploadMedia(files[index], 'image', { alt: fileDescription(files[index]) });
        setData(previous => ({ ...previous, gallery: [...previous.gallery, item.url],
          galleryAlts: [...previous.galleryAlts, item.alt], galleryCaptions: [...previous.galleryCaptions, item.caption || ''] }));
      }
    } catch (err) { setError(err.message); }
    finally { onBusy(false); setMessage(''); }
  }
  return <div className="wide admin-gallery">
    <h3>Project gallery</h3><p>Add images, check their descriptions, then save the project.</p>
    <label>Upload gallery images<input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif,.avif" onChange={upload} /></label>
    <button type="button" className="secondary" onClick={onPick}>Add existing image</button>
    {message && <p role="status">{message}</p>}{error && <p role="alert" className="admin-error">{error}</p>}
    <div className="admin-media-grid">{data.gallery.map((url, index) => <article key={`${index}-${url}`}>
      <img src={imageUrl(url, 480)} alt={data.galleryAlts[index] || ''} />
      <label>Image {index + 1} description<input value={data.galleryAlts[index] || ''} onChange={e => update(index, 'galleryAlts', e.target.value)} required /></label>
      <label>Caption<input value={data.galleryCaptions[index] || ''} onChange={e => update(index, 'galleryCaptions', e.target.value)} /></label>
      <div className="admin-actions"><button type="button" className="secondary" disabled={index === 0} onClick={() => move(index, -1)}>Move up</button><button type="button" className="secondary" disabled={index === data.gallery.length - 1} onClick={() => move(index, 1)}>Move down</button><button type="button" className="secondary" onClick={() => remove(index)}>Remove</button></div>
    </article>)}</div>
  </div>;
}
