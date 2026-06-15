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

    let score: number;
    let reason: string;

    if (personality === "familiar") {
      score = familiarity * 1.3 + freshness;
      reason = best ? best.reason : "Close to what you love";
    } else if (personality === "explorer") {
      const novelty = isNovel ? 2.2 : 0;
      score = familiarity * 0.55 + novelty + freshness + jitter * 1.6;
      reason = isNovel
        ? "A fresh sound to explore"
        : best
          ? best.reason
          : "Worth a listen";
    } else {
      score = familiarity + freshness + jitter * 0.7;
      reason = best ? best.reason : "New in your discovery pool";
    }

    return { song: { ...song, matchReason: reason }, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.song);
}
