import api from './api';

export async function uploadMedia(file, kind, { alt = '', caption = '', onProgress = () => {} } = {}) {
  const formats = kind === 'image' ? /\.(jpg|jpeg|png|gif|webp|avif)$/i : /\.(mp4|mov|webm)$/i;
  if (!formats.test(file.name) || (file.type && !file.type.startsWith(`${kind}/`))) {
    throw new Error(kind === 'image' ? 'Choose a JPG, PNG, WebP, GIF or AVIF image.' : 'Choose an MP4, MOV or WebM video.');
  }
  const maxBytes = (kind === 'image' ? 10 : 100) * 1024 * 1024;
  if (file.size > maxBytes) throw new Error(`${kind === 'image' ? 'Images' : 'Videos'} must be under ${kind === 'image' ? 10 : 100} MB.`);
  const signed = await api.post('/api/admin/media/sign', { resourceType: kind });
  const body = new FormData();
  body.append('file', file);
  body.append('api_key', signed.apiKey);
  body.append('signature', signed.signature);
  for (const [key, value] of Object.entries(signed.params)) body.append(key, Array.isArray(value) ? value.join(',') : String(value));
  const result = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${signed.cloudName}/${kind}/upload`);
    xhr.timeout = 300000;
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)); };
    xhr.onerror = () => reject(new Error('Upload connection failed. Please try again.'));
    xhr.ontimeout = () => reject(new Error('Upload timed out. Please try a smaller file.'));
    xhr.onload = () => {
      let data;
      try { data = JSON.parse(xhr.responseText); } catch { reject(new Error('Cloudinary returned an invalid response.')); return; }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error?.message || 'Media upload failed.'));
    };
    xhr.send(body);
  });
  // The upload can complete before the provider's resource API sees the file.
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await api.post('/api/admin/media/register', { publicId: result.public_id, alt: alt.trim(), caption: caption.trim() }); }
    catch (error) {
      if (error.status !== 502 || attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

export function fileDescription(file) {
  return file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 240);
}
