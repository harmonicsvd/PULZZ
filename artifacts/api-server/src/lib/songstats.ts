import { logger } from "./logger";

const BASE = "https://api.songstats.com/enterprise/v1";
const REQUEST_TIMEOUT_MS = 9000;
const CACHE_TTL_MS = 10 * 60 * 1000;

export type SongstatsStatus =
  | "ok"
  | "pre_release"
  | "no_identifier"
  | "not_found"
  | "unconfigured"
  | "error";

export interface SongstatsSource {
  source: string;
  streamsTotal: number | null;
  streamsCurrent: number | null;
  playsTotal: number | null;
  viewsTotal: number | null;
  playlistsTotal: number | null;
  playlistsCurrent: number | null;
  playlistReachTotal: number | null;
  chartsTotal: number | null;
  chartsCurrent: number | null;
  videosTotal: number | null;
  creatorReachTotal: number | null;
  shazamsTotal: number | null;
}

export interface SongstatsTrackInfo {
  title: string | null;
  artistName: string | null;
  releaseDate: string | null;
}

export interface SongstatsResult {
  status: SongstatsStatus;
  available: boolean;
  message: string | null;
  identifier: string | null;
  trackInfo: SongstatsTrackInfo | null;
  streamsTotal: number | null;
  playlistReachTotal: number | null;
  playlistsTotal: number | null;
  chartsTotal: number | null;
  streamsRecent: number | null;
  playlistsRecent: number | null;
  chartsRecent: number | null;
  sources: SongstatsSource[];
  fetchedAt: string;
}

interface CacheEntry {
  expiresAt: number;
  value: SongstatsResult;
}

const cache = new Map<string, CacheEntry>();

function apiKey(): string | null {
  const key = process.env.SONGSTATS_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : null;
}

/**
 * Resolves an artist-supplied identifier (ISRC, Spotify track id, or a Spotify
 * track URL) into the appropriate Songstats query parameter.
 */
export function resolveIdentifier(
  raw: string
): { param: "isrc" | "spotify_track_id"; value: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const spotifyUrl = trimmed.match(/open\.spotify\.com\/track\/([A-Za-z0-9]{22})/);
  if (spotifyUrl) {
    return { param: "spotify_track_id", value: spotifyUrl[1] };
  }

  const spotifyUri = trimmed.match(/^spotify:track:([A-Za-z0-9]{22})$/);
  if (spotifyUri) {
    return { param: "spotify_track_id", value: spotifyUri[1] };
  }

  // Bare Spotify track id (22 base62 chars)
  if (/^[A-Za-z0-9]{22}$/.test(trimmed)) {
    return { param: "spotify_track_id", value: trimmed };
  }

  // ISRC: 12 alphanumeric chars (e.g. USRC17607839), allow hyphenated form
  const isrc = trimmed.replace(/-/g, "").toUpperCase();
  if (/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/.test(isrc)) {
    return { param: "isrc", value: isrc };
  }

  return null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeSource(entry: Record<string, unknown>): SongstatsSource | null {
  const source = entry.source;
  if (typeof source !== "string" || source.length === 0) return null;
  const data = (entry.data as Record<string, unknown>) ?? {};
  return {
    source,
    streamsTotal: num(data.streams_total),
    streamsCurrent: num(data.streams_current),
    playsTotal: num(data.plays_total),
    viewsTotal: num(data.views_total),
    playlistsTotal: num(data.playlists_total),
    playlistsCurrent: num(data.playlists_current),
    playlistReachTotal: num(data.playlist_reach_total),
    chartsTotal: num(data.charts_total),
    chartsCurrent: num(data.charts_current),
    videosTotal: num(data.videos_total),
    creatorReachTotal: num(data.creator_reach_total),
    shazamsTotal: num(data.shazams_total),
  };
}

function buildResult(
  identifier: string,
  body: Record<string, unknown>
): SongstatsResult {
  const info = (body.track_info as Record<string, unknown>) ?? {};
  const rawStats = Array.isArray(body.stats) ? body.stats : [];
  const sources = rawStats
    .map((s) => normalizeSource(s as Record<string, unknown>))
    .filter((s): s is SongstatsSource => s !== null);

  const spotify = sources.find((s) => s.source === "spotify");
  const streamsTotal =
    spotify?.streamsTotal ??
    sources.reduce<number | null>((acc, s) => {
      if (s.streamsTotal === null && s.playsTotal === null) return acc;
      return (acc ?? 0) + (s.streamsTotal ?? s.playsTotal ?? 0);
    }, null);
  const playlistReachTotal = sources.reduce<number | null>((acc, s) => {
    if (s.playlistReachTotal === null) return acc;
    return (acc ?? 0) + s.playlistReachTotal;
  }, null);
  const playlistsTotal = sources.reduce<number | null>((acc, s) => {
    if (s.playlistsTotal === null) return acc;
    return (acc ?? 0) + s.playlistsTotal;
  }, null);
  const chartsTotal = sources.reduce<number | null>((acc, s) => {
    if (s.chartsTotal === null) return acc;
    return (acc ?? 0) + s.chartsTotal;
  }, null);

  // "Recent" (current-period) movement, summed across platforms. Songstats
  // reports *_current as the latest reporting window, so these surface the
  // song's recent trend rather than its all-time totals.
  const streamsRecent =
    spotify?.streamsCurrent ??
    sources.reduce<number | null>((acc, s) => {
      if (s.streamsCurrent === null) return acc;
      return (acc ?? 0) + s.streamsCurrent;
    }, null);
  const playlistsRecent = sources.reduce<number | null>((acc, s) => {
    if (s.playlistsCurrent === null) return acc;
    return (acc ?? 0) + s.playlistsCurrent;
  }, null);
  const chartsRecent = sources.reduce<number | null>((acc, s) => {
    if (s.chartsCurrent === null) return acc;
    return (acc ?? 0) + s.chartsCurrent;
  }, null);

  return {
    status: "ok",
    available: true,
    message: null,
    identifier,
    trackInfo: {
      title: typeof info.title === "string" ? info.title : null,
      artistName: typeof info.artist_name === "string" ? info.artist_name : null,
      releaseDate:
        typeof info.release_date === "string" ? info.release_date : null,
    },
    streamsTotal,
    playlistReachTotal,
    playlistsTotal,
    chartsTotal,
    streamsRecent,
    playlistsRecent,
    chartsRecent,
    sources,
    fetchedAt: new Date().toISOString(),
  };
}

function emptyResult(
  status: SongstatsStatus,
  message: string | null,
  identifier: string | null
): SongstatsResult {
  return {
    status,
    available: false,
    message,
    identifier,
    trackInfo: null,
    streamsTotal: null,
    playlistReachTotal: null,
    playlistsTotal: null,
    chartsTotal: null,
    streamsRecent: null,
    playlistsRecent: null,
    chartsRecent: null,
    sources: [],
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetches current post-release stats for a track from Songstats by an
 * artist-supplied identifier. Returns a normalized result that always carries a
 * `status`, so callers can render a tasteful fallback when the key is missing,
 * the identifier is unusable, or Songstats has no data yet. Successful lookups
 * are cached in memory for a short window to respect Songstats rate limits.
 */
export async function getTrackStats(
  rawIdentifier: string | null | undefined,
  opts?: { released?: boolean }
): Promise<SongstatsResult> {
  // Pre-release gating: a song that has not been released yet must never show
  // live post-release numbers, even if an identifier was attached early.
  if (opts && opts.released === false) {
    return emptyResult("pre_release", null, rawIdentifier?.trim() || null);
  }

  if (!rawIdentifier || rawIdentifier.trim().length === 0) {
    return emptyResult("no_identifier", null, null);
  }

  const resolved = resolveIdentifier(rawIdentifier);
  if (!resolved) {
    return emptyResult(
      "no_identifier",
      "Identifier is not a recognized ISRC or Spotify track link.",
      rawIdentifier.trim()
    );
  }

  const key = apiKey();
  if (!key) {
    return emptyResult("unconfigured", null, rawIdentifier.trim());
  }

  const cacheKey = `${resolved.param}:${resolved.value}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const url = new URL(`${BASE}/tracks/stats`);
  url.searchParams.set(resolved.param, resolved.value);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { apikey: key, Accept: "application/json" },
    });

    if (res.status === 404) {
      const result = emptyResult("not_found", null, rawIdentifier.trim());
      cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value: result });
      return result;
    }

    if (!res.ok) {
      logger.warn({ status: res.status }, "Songstats stats request failed");
      return emptyResult("error", null, rawIdentifier.trim());
    }

    const json = (await res.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!json) {
      return emptyResult("error", null, rawIdentifier.trim());
    }

    const result = buildResult(rawIdentifier.trim(), json);
    if (result.sources.length === 0) {
      const fallback = emptyResult("not_found", null, rawIdentifier.trim());
      cache.set(cacheKey, {
        expiresAt: Date.now() + CACHE_TTL_MS,
        value: fallback,
      });
      return fallback;
    }
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value: result });
    return result;
  } catch (err) {
    logger.error({ err }, "Songstats stats request errored");
    return emptyResult("error", null, rawIdentifier.trim());
  } finally {
    clearTimeout(timeout);
  }
}
