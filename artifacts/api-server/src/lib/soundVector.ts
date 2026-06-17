import type { CyaniteAnalysis } from "@workspace/db";

/**
 * Normalized, comparable sound profile derived from a Cyanite analysis. The
 * `vector` is what powers similarity (cosine) between songs/artists; the scalar
 * and `top*` fields are for display. Vectors are built in a deterministic order
 * (scalars, then alphabetically-keyed genre + mood distributions) so any two
 * profiles from the same Cyanite model are dimensionally aligned.
 */
export interface SoundProfile {
  energy: number;
  valence: number;
  arousal: number;
  topGenres: string[];
  topMoods: string[];
  vector: number[];
}

const ENERGY_MAP: Record<string, number> = {
  verylow: 0.1,
  low: 0.25,
  medium: 0.5,
  moderate: 0.5,
  high: 0.8,
  veryhigh: 0.95,
};

function energyToNum(level: string | null | undefined): number {
  if (!level) return 0;
  return ENERGY_MAP[level.toLowerCase()] ?? 0.5;
}

function clamp01(n: number | null | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function topKeys(dist: Record<string, number> | undefined, n: number): string[] {
  if (!dist) return [];
  return Object.entries(dist)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

function sortedValues(dist: Record<string, number> | undefined): number[] {
  if (!dist) return [];
  return Object.keys(dist)
    .sort()
    .map((k) => clamp01(dist[k]));
}

/**
 * Builds a sound profile from a Cyanite analysis, or `null` when the analysis
 * carries no usable tonal signal. Very old / noisy recordings analyze
 * near-empty (no tags, zeroed distributions), and a profile of all-zeros would
 * report a misleading "100% match" against anything — so callers treat `null`
 * as "no sound data" and fall back to their existing heuristics.
 */
export function toSoundProfile(
  analysis: CyaniteAnalysis | null | undefined
): SoundProfile | null {
  if (!analysis) return null;
  const genreVals = Object.values(analysis.genre ?? {});
  const moodVals = Object.values(analysis.mood ?? {});
  const valence = clamp01(analysis.valence);
  const arousal = clamp01(analysis.arousal);
  const hasSignal =
    genreVals.some((v) => v > 0) ||
    moodVals.some((v) => v > 0) ||
    valence > 0 ||
    arousal > 0 ||
    (analysis.genreTags?.length ?? 0) > 0 ||
    (analysis.moodTags?.length ?? 0) > 0;
  if (!hasSignal) return null;

  const energy = energyToNum(analysis.energyLevel);
  const vector = [
    energy,
    valence,
    arousal,
    ...sortedValues(analysis.genre),
    ...sortedValues(analysis.mood),
  ];
  return {
    energy,
    valence,
    arousal,
    topGenres: topKeys(analysis.genre, 3),
    topMoods: topKeys(analysis.mood, 3),
    vector,
  };
}

/** Mean profile across a set (e.g. an artist's catalog). `null` if empty. */
export function meanProfile(profiles: SoundProfile[]): SoundProfile | null {
  if (profiles.length === 0) return null;
  const len = profiles[0].vector.length;
  const usable = profiles.filter((p) => p.vector.length === len);
  if (usable.length === 0) return null;

  const sum = new Array<number>(len).fill(0);
  let energy = 0;
  let valence = 0;
  let arousal = 0;
  const genres = new Set<string>();
  const moods = new Set<string>();
  for (const p of usable) {
    for (let i = 0; i < len; i++) sum[i] += p.vector[i];
    energy += p.energy;
    valence += p.valence;
    arousal += p.arousal;
    p.topGenres.forEach((g) => genres.add(g));
    p.topMoods.forEach((m) => moods.add(m));
  }
  return {
    energy: energy / usable.length,
    valence: valence / usable.length,
    arousal: arousal / usable.length,
    topGenres: [...genres].slice(0, 3),
    topMoods: [...moods].slice(0, 3),
    vector: sum.map((s) => s / usable.length),
  };
}

/** Cosine similarity (0..1) between two equal-length, non-negative vectors. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return Math.max(0, Math.min(1, dot / (Math.sqrt(na) * Math.sqrt(nb))));
}
