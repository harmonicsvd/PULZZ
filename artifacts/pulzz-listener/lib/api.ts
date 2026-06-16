import type { DemoSong, SongCredits, SongLicense } from "@/data/songs";

const getBase = () => {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api`;
  return "/api";
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBase()}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export interface ApiSong {
  id: number;
  title: string;
  artistName: string;
  genre: string;
  releaseDate: string;
  daysUntilRelease: number;
  status: string;
  coverColor: string;
  tags: string[];
  audioUrl: string;
  artworkUrl: string | null;
  durationSeconds: number;
  license: SongLicense | null;
  discoveredCount: number | null;
  skipCount: number | null;
}

export interface ApiSongDetail extends ApiSong {
  story: string;
  lyrics: string | null;
  lrc: string | null;
  credits: SongCredits | null;
  isrc: string;
  instruments: string[];
}

function colorToGradient(hex: string): [string, string] {
  const h = hex.replace("#", "").padEnd(6, "0");
  const r = Math.floor(parseInt(h.substring(0, 2), 16) * 0.4);
  const g = Math.floor(parseInt(h.substring(2, 4), 16) * 0.4);
  const b = Math.floor(parseInt(h.substring(4, 6), 16) * 0.4);
  const darker = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  return [darker, hex];
}

export function apiSongToDemoSong(s: ApiSong): DemoSong {
  return {
    id: String(s.id),
    title: s.title,
    artist: s.artistName,
    genre: s.genre,
    tags: s.tags ?? [],
    story: "",
    lyrics: "",
    releaseDate: s.releaseDate,
    daysUntilRelease: s.daysUntilRelease,
    durationSeconds: s.durationSeconds ?? 0,
    audioUrl: s.audioUrl,
    artworkUrl: s.artworkUrl ?? undefined,
    license: s.license ?? undefined,
    coverGradient: colorToGradient(s.coverColor ?? "#333333"),
    matchReason: "In the discovery pool",
    bpm: 0,
    instruments: [],
  };
}

export function apiSongDetailToDemoSong(s: ApiSongDetail): DemoSong {
  return {
    ...apiSongToDemoSong(s),
    story: s.story ?? "",
    lyrics: s.lyrics ?? "",
    lrc: s.lrc ?? undefined,
    credits: s.credits ?? undefined,
    instruments: s.instruments ?? [],
  };
}

export interface MxmGenre {
  id: number;
  name: string;
  parentId: number | null;
}

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

export const api = {
  fetchSongs: () => apiFetch<ApiSong[]>("/songs"),

  fetchSongDetail: (id: number) =>
    apiFetch<ApiSongDetail>(`/songs/${id}`),

  createListener: (data: {
    name: string;
    genres: string[];
    discoveryPersonality: "explorer" | "balanced" | "familiar";
  }) =>
    apiFetch<{ id: number; name: string }>("/listeners", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createReaction: (data: {
    songId: number;
    listenerId: number;
    type: "discovered" | "skip";
  }) =>
    apiFetch<unknown>("/reactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createMomentMark: (data: {
    songId: number;
    listenerId: number;
    timestampMs: number;
  }) =>
    apiFetch<unknown>("/moment-marks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  fetchMusixmatchGenres: () =>
    apiFetch<MxmGenre[]>("/musixmatch/genres"),

  searchMusixmatchTracks: (q: string, pageSize = 10) =>
    apiFetch<MxmTrack[]>(
      `/musixmatch/search-tracks?q=${encodeURIComponent(q)}&pageSize=${pageSize}`
    ),

  getMusixmatchSubtitle: (trackId: number) =>
    apiFetch<MxmSubtitle>(`/musixmatch/subtitle?trackId=${trackId}`),

  getMusixmatchAnalysis: (trackId: number) =>
    apiFetch<MxmAnalysis>(`/musixmatch/track-analysis?trackId=${trackId}`),
};
