export function imageUrl(url, width = 1200) {
  if (!url?.includes('res.cloudinary.com/') || !url.includes('/image/upload/')) return url || '';
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
export const imageSrcSet = url => url?.includes('/image/upload/') ? [480, 800, 1200, 1600].map(width => `${imageUrl(url, width)} ${width}w`).join(', ') : undefined;
