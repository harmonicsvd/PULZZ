// Resolves a media path to an absolute URL.
//
// Audio + cover art are served by the API server under relative paths like
// `/api/media/song-1.mp3`. On web those resolve against the page origin, but
// expo-av / Image on native need a fully-qualified URL, so we prefix the
// Replit domain (same source as the API base). Already-absolute URLs
// (e.g. legacy archive.org links) pass through unchanged.
export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  const base = domain ? `https://${domain}` : "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
