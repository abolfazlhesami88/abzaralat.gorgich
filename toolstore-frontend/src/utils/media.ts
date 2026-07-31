const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const MEDIA_BASE = API_BASE.replace(/\/api\/?$/, '');

export function getMediaUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${MEDIA_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}
