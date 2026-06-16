import { logger } from "./logger";

const BASE = "https://api.musixmatch.com/ws/1.1";

export interface MxmTrack {
  id: number;
  name: string;
  artistId: number;
  artistName: string;
  albumName: string | null;
  genres: string[];
  artworkUrl: string | null;
  hasSubtitles: boolean;
  hasRichsync: boolean;
  instrumental: boolean;
  spotifyId: string | null;
}

export interface MxmGenre {
  id: number;
  name: string;
  parentId: number | null;
}

export interface MxmSubtitle {
  trackId: number;
  found: boolean;
  format: string;
  body: string;
  language: string | null;
}

export interface MxmAnalysis {
  trackId: number;
  moods: string[];
  themes: string[];
}

export interface MxmLyricsAnalysis {
  mood: string[];
  themes: string[];
  language: string | null;
}

interface MxmResponse<T> {
  message: {
    header: { status_code: number };
    body: T;
  };
}

function apiKey(): string {
  const key = process.env.MUSIXMATCH_API_KEY;
  if (!key) throw new Error("MUSIXMATCH_API_KEY is not configured");
  return key;
}

const REQUEST_TIMEOUT_MS = 8000;

async function call<T>(method: string, params: Record<string, string | number>): Promise<{ statusCode: number; body: T | null }> {
  const url = new URL(`${BASE}/${method}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  url.searchParams.set("apikey", apiKey());
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    const json = (await res.json().catch(() => null)) as MxmResponse<T> | null;
    const statusCode = json?.message?.header?.status_code ?? res.status;
    return { statusCode, body: json?.message?.body ?? null };
  } finally {
    clearTimeout(timeout);
  }
}

function genreNames(primary: unknown): string[] {
  const list = (primary as { music_genre_list?: Array<{ music_genre?: { music_genre_name?: string } }> })?.music_genre_list;
  if (!Array.isArray(list)) return [];
  const names = list
    .map((g) => g.music_genre?.music_genre_name)
    .filter((n): n is string => typeof n === "string" && n.length > 0);
  return Array.from(new Set(names));
}

function bestArtwork(t: Record<string, unknown>): string | null {
  const candidates = [
    t.album_coverart_800x800,
    t.album_coverart_500x500,
    t.album_coverart_350x350,
    t.album_coverart_100x100,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0 && !c.includes("nocover")) {
      return c.replace(/^http:/, "https:");
    }
  }
  return null;
}

export async function getGenres(): Promise<MxmGenre[]> {
  const { statusCode, body } = await call<{ music_genre_list?: Array<{ music_genre?: Record<string, unknown> }> }>(
    "music.genres.get",
    {}
  );
  if (statusCode !== 200 || !body?.music_genre_list) {
    logger.warn({ statusCode }, "Musixmatch genres fetch failed");
    return [];
  }
  const seen = new Set<string>();
  const out: MxmGenre[] = [];
  for (const entry of body.music_genre_list) {
    const g = entry.music_genre;
    const id = g?.music_genre_id;
    const name = g?.music_genre_name;
    if (typeof id !== "number" || typeof name !== "string") continue;
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({
      id,
      name,
      parentId: typeof g?.music_genre_parent_id === "number" ? (g.music_genre_parent_id as number) : null,
    });
  }
  return out;
}

export async function searchTracks(q: string, pageSize: number): Promise<MxmTrack[]> {
  const { statusCode, body } = await call<{ track_list?: Array<{ track?: Record<string, unknown> }> }>("track.search", {
    q,
    page_size: Math.max(1, Math.min(50, pageSize)),
    s_track_rating: "desc",
    f_has_lyrics: 1,
  });
  if (statusCode !== 200 || !body?.track_list) {
    logger.warn({ statusCode }, "Musixmatch track search failed");
    return [];
  }
  return body.track_list
    .map((entry) => entry.track)
    .filter((t): t is Record<string, unknown> => !!t && typeof t.track_id === "number")
    .map((t) => ({
      id: t.track_id as number,
      name: (t.track_name as string) ?? "",
      artistId: typeof t.artist_id === "number" ? (t.artist_id as number) : 0,
      artistName: (t.artist_name as string) ?? "",
      albumName: typeof t.album_name === "string" && t.album_name.length > 0 ? (t.album_name as string) : null,
      genres: genreNames(t.primary_genres),
      artworkUrl: bestArtwork(t),
      hasSubtitles: t.has_subtitles === 1,
      hasRichsync: t.has_richsync === 1,
      instrumental: t.instrumental === 1,
      spotifyId: typeof t.track_spotify_id === "string" && t.track_spotify_id.length > 0 ? (t.track_spotify_id as string) : null,
    }));
}

export async function getSubtitle(trackId: number): Promise<MxmSubtitle> {
  const { statusCode, body } = await call<{ subtitle?: { subtitle_body?: string; subtitle_language?: string } }>(
    "track.subtitle.get",
    { track_id: trackId, subtitle_format: "lrc" }
  );
  const subtitleBody = body?.subtitle?.subtitle_body;
  if (statusCode !== 200 || typeof subtitleBody !== "string" || subtitleBody.length === 0) {
    return { trackId, found: false, format: "lrc", body: "", language: null };
  }
  return {
    trackId,
    found: true,
    format: "lrc",
    body: subtitleBody,
    language: typeof body?.subtitle?.subtitle_language === "string" ? body.subtitle.subtitle_language : null,
  };
}

function extractStrings(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === "string") return v;
        if (v && typeof v === "object") {
          const obj = v as Record<string, unknown>;
          return (obj.mood ?? obj.theme ?? obj.label ?? obj.name) as string | undefined;
        }
        return undefined;
      })
      .filter((s): s is string => typeof s === "string" && s.length > 0);
  }
  return [];
}

export async function getAnalysis(trackId: number): Promise<MxmAnalysis> {
  const { statusCode, body } = await call<{ analysis?: Record<string, unknown> }>("track.lyrics.analysis.get", {
    track_id: trackId,
  });
  if (statusCode !== 200 || !body?.analysis) {
    return { trackId, moods: [], themes: [] };
  }
  const analysis = body.analysis;
  const moodsRaw =
    (analysis.moods as Record<string, unknown>)?.mood_list ??
    (analysis.moods as Record<string, unknown>)?.main_moods ??
    analysis.moods;
  const themesRaw = (analysis.themes as Record<string, unknown>)?.main_themes ?? analysis.themes;
  return {
    trackId,
    moods: extractStrings(moodsRaw).slice(0, 12),
    themes: extractStrings(themesRaw).slice(0, 12),
  };
}

function detectLanguage(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (/[\u3040-\u30ff]/.test(trimmed)) return "ja";
  if (/[\uac00-\ud7af]/.test(trimmed)) return "ko";
  if (/[\u4e00-\u9fff]/.test(trimmed)) return "zh";
  if (/[\u0600-\u06ff]/.test(trimmed)) return "ar";
  if (/[\u0400-\u04ff]/.test(trimmed)) return "ru";
  if (/[áéíóúñ¿¡]/i.test(trimmed)) return "es";
  if (/[àâçéèêëîïôûùüœ]/i.test(trimmed)) return "fr";
  if (/[äöüß]/i.test(trimmed)) return "de";
  if (/[a-z]/i.test(trimmed)) return "en";
  return null;
}

/**
 * Derives mood, themes and language for a song's lyrics by reusing the
 * Musixmatch lyrics analysis capability. The analysis endpoint is track-based,
 * so we search for the best matching released track (using title/lyrics) and
 * pull its mood/theme analysis. Language is taken from the matched track's
 * subtitle, falling back to a lightweight script-based detection on the lyrics.
 */
export async function analyzeLyrics(
  query: string,
  lyrics: string
): Promise<MxmLyricsAnalysis> {
  const fallbackLanguage = detectLanguage(lyrics);
  const tracks = await searchTracks(query, 1);
  const track = tracks[0];
  if (!track) {
    return { mood: [], themes: [], language: fallbackLanguage };
  }
  const [analysis, subtitle] = await Promise.all([
    getAnalysis(track.id),
    getSubtitle(track.id),
  ]);
  return {
    mood: analysis.moods,
    themes: analysis.themes,
    language: subtitle.language ?? fallbackLanguage,
  };
}
