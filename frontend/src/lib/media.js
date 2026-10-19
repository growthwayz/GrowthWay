// Cloudinary chooses a delivery format supported by the requesting browser.
// https://cloudinary.com/documentation/video_optimization
export function videoUrl(url) {
  if (!url?.startsWith('https://res.cloudinary.com/') || !url.includes('/video/upload/')) return url || '';
  return url.replace('/video/upload/', '/video/upload/f_auto/q_auto/');
}
