import type { DemoSong } from "@/data/songs";
import type {
  Discovery,
  ListenerProfile,
  MomentMark,
} from "@/contexts/AppContext";

interface Signal {
  token: string;
  weight: number;
  reason: string;
}

interface RecommendInput {
  songs: DemoSong[];
  profile: ListenerProfile | null;
  discoveries: Discovery[];
  momentMarks: MomentMark[];
  listenedSongIds: string[];
}

function songTokens(song: DemoSong): string[] {
  return [song.genre, ...song.tags].map((t) => t.toLowerCase());
}

function tokenMatches(token: string, tokens: string[]): boolean {
  const t = token.toLowerCase().trim();
  if (!t) return false;
  return tokens.some((s) => s === t || s.includes(t) || t.includes(s));
}

function hashJitter(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return h / 997;
}

/** Cosine similarity (0..1) over two equal-length, non-negative vectors. */
function cosineSimilarity(a: number[], b: number[]): number {
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

/**
 * Mean of the sound vectors of the songs the listener has engaged with — their
 * "sonic taste centroid". Returns null when none of those songs carry a Cyanite
 * sound profile (e.g. the archival demo catalog), so callers skip the boost.
 */
function tasteSoundVector(input: RecommendInput): number[] | null {
  const songById = new Map(input.songs.map((s) => [s.id, s]));
  const liked = [
    ...input.discoveries.map((d) => d.songId),
    ...input.momentMarks.map((m) => m.songId),
  ];
  const vectors: number[][] = [];
  for (const id of liked) {
    const v = songById.get(id)?.soundProfile?.vector;
    if (v && v.length > 0) vectors.push(v);
  }
  if (vectors.length === 0) return null;
  const len = vectors[0].length;
  const aligned = vectors.filter((v) => v.length === len);
  if (aligned.length === 0) return null;
  const sum = new Array<number>(len).fill(0);
  for (const v of aligned) for (let i = 0; i < len; i++) sum[i] += v[i];
  return sum.map((s) => s / aligned.length);
}

function buildSignals(input: RecommendInput): {
  positives: Signal[];
  negatives: Signal[];
  tasteGenres: Set<string>;
} {
  const { profile, discoveries, momentMarks, listenedSongIds, songs } = input;
  const positives: Signal[] = [];
  const negatives: Signal[] = [];
  const tasteGenres = new Set<string>();

  if (profile) {
    for (const g of profile.genres) {
      positives.push({ token: g, weight: 2, reason: `Because you love ${g}` });
      tasteGenres.add(g.toLowerCase());
    }
    const taste = profile.taste;
    if (taste) {
      taste.genres.forEach((g, i) => {
        positives.push({
          token: g,
          weight: Math.max(0.8, 2 - i * 0.2),
          reason: `Your taste leans ${g}`,
        });
        tasteGenres.add(g.toLowerCase());
      });
      taste.moods.forEach((m, i) =>
        positives.push({
          token: m,
          weight: Math.max(0.6, 1.4 - i * 0.15),
          reason: `Matches your ${m} mood`,
        })
      );
      taste.themes.forEach((t, i) =>
        positives.push({
          token: t,
          weight: Math.max(0.5, 1.1 - i * 0.15),
          reason: `Songs about ${t}`,
        })
      );
    }
  }

  const songById = new Map(songs.map((s) => [s.id, s]));
  const discoveredIds = new Set(discoveries.map((d) => d.songId));

  for (const d of discoveries) {
    const song = songById.get(d.songId);
    const tags = song ? song.tags : [];
    positives.push({
      token: d.genre,
      weight: 1.5,
      reason: `More ${d.genre} like you've discovered`,
    });
    for (const tag of tags) {
      positives.push({
        token: tag,
        weight: 1,
        reason: `Like the ${tag} songs you've saved`,
      });
    }
  }

  for (const mark of momentMarks) {
    const song = songById.get(mark.songId);
    if (!song) continue;
    positives.push({
      token: song.genre,
      weight: 2.5,
      reason: `You marked moments in ${song.genre}`,
    });
    for (const tag of song.tags) {
      positives.push({
        token: tag,
        weight: 1.5,
        reason: `From the moments you loved`,
      });
    }
  }

  const skippedIds = listenedSongIds.filter((id) => !discoveredIds.has(id));
  for (const id of skippedIds) {
    const song = songById.get(id);
    if (!song) continue;
    negatives.push({ token: song.genre, weight: 1.2, reason: "" });
    for (const tag of song.tags) {
      negatives.push({ token: tag, weight: 0.5, reason: "" });
    }
  }

  return { positives, negatives, tasteGenres };
}

export function rankSongs(input: RecommendInput): DemoSong[] {
  const candidates = input.songs.filter(
    (s) => !input.listenedSongIds.includes(s.id)
  );
  const { positives, negatives, tasteGenres } = buildSignals(input);
  const personality = input.profile?.discoveryPersonality ?? "balanced";

  // Cyanite sound-similarity: boost songs whose sound fingerprint matches the
  // listener's "sonic taste centroid". Explorers value novelty, so they get a
  // lighter pull toward what already sounds familiar.
  const tasteVector = tasteSoundVector(input);
  const soundWeight =
    personality === "familiar" ? 3 : personality === "explorer" ? 1.4 : 2.2;

  const scored = candidates.map((song) => {
    const tokens = songTokens(song);

    let positive = 0;
    let best: Signal | null = null;
    for (const sig of positives) {
      if (tokenMatches(sig.token, tokens)) {
        positive += sig.weight;
        if (!best || sig.weight > best.weight) best = sig;
      }
    }

    let negative = 0;
    for (const sig of negatives) {
      if (tokenMatches(sig.token, tokens)) negative += sig.weight;
    }

    const familiarity = positive - negative;
    const isNovel = !tasteGenres.has(song.genre.toLowerCase());
    const freshness = Math.max(0, 14 - song.daysUntilRelease) * 0.04;
    const jitter = hashJitter(song.id);

    const soundSim =
      tasteVector && song.soundProfile
        ? cosineSimilarity(tasteVector, song.soundProfile.vector)
        : 0;
    const soundBoost = soundSim * soundWeight;

    let score: number;
    let reason: string;

    if (personality === "familiar") {
      score = familiarity * 1.3 + freshness + soundBoost;
      reason = best ? best.reason : "Close to what you love";
    } else if (personality === "explorer") {
      const novelty = isNovel ? 2.2 : 0;
      score =
        familiarity * 0.55 + novelty + freshness + jitter * 1.6 + soundBoost;
      reason = isNovel
        ? "A fresh sound to explore"
        : best
          ? best.reason
          : "Worth a listen";
    } else {
      score = familiarity + freshness + jitter * 0.7 + soundBoost;
      reason = best ? best.reason : "New in your discovery pool";
    }

    // A strong sonic match is the most compelling story to tell — surface it.
    if (soundSim >= 0.6 && soundBoost >= (best?.weight ?? 0)) {
      reason = "Sounds like what you've been loving";
    }

    return { song: { ...song, matchReason: reason }, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.song);
}
