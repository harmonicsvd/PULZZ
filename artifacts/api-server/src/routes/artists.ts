import { Router, type IRouter } from "express";
import { count, desc, eq, isNotNull } from "drizzle-orm";
import {
  db,
  artistsTable,
  songsTable,
  reactionsTable,
  momentMarksTable,
  listenersTable,
} from "@workspace/db";
import {
  toSoundProfile,
  meanProfile,
  type SoundProfile,
} from "../lib/soundVector";
import { requireArtist } from "../middlewares/auth";
import {
  CreateArtistBody,
  GetArtistDashboardParams,
  GetArtistDashboardResponse,
  GetArtistParams,
  GetArtistResponse,
  GetArtistSongsParams,
  GetArtistSongsResponse,
  GetArtistSongstatsParams,
  GetArtistSongstatsResponse,
  ListArtistsResponse,
  UpdateArtistBody,
  UpdateArtistParams,
  UpdateArtistResponse,
} from "@workspace/api-zod";
import { getTrackStats, isConfigured } from "../lib/songstats";

const router: IRouter = Router();

const URL_RE = /^https?:\/\/.+/;

/**
 * Builds a per-artist mean sound profile from every song that has a usable
 * Cyanite analysis. Artists with no analyzable catalog map to `null`, so
 * sound-based collaboration ranking degrades cleanly to role matching.
 */
async function soundProfilesByArtist(): Promise<Map<number, SoundProfile>> {
  const rows = await db
    .select({
      artistId: songsTable.artistId,
      cyaniteAnalysis: songsTable.cyaniteAnalysis,
    })
    .from(songsTable)
    .where(isNotNull(songsTable.cyaniteAnalysis));

  const grouped = new Map<number, SoundProfile[]>();
  for (const r of rows) {
    const profile = toSoundProfile(r.cyaniteAnalysis);
    if (!profile) continue;
    const list = grouped.get(r.artistId) ?? [];
    list.push(profile);
    grouped.set(r.artistId, list);
  }

  const out = new Map<number, SoundProfile>();
  for (const [artistId, profiles] of grouped) {
    const mean = meanProfile(profiles);
    if (mean) out.set(artistId, mean);
  }
  return out;
}

function findInvalidLink(
  links: Record<string, string | undefined> | null | undefined
): string | null {
  if (!links) return null;
  for (const [key, value] of Object.entries(links)) {
    if (value && !URL_RE.test(value)) return key;
  }
  return null;
}

router.get("/artists", async (_req, res): Promise<void> => {
  const [artists, profiles] = await Promise.all([
    db.select().from(artistsTable).orderBy(artistsTable.name),
    soundProfilesByArtist(),
  ]);

  res.json(
    ListArtistsResponse.parse(
      artists.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        soundProfile: profiles.get(a.id) ?? null,
        featuredSongId: a.featuredSongId,
      }))
    )
  );
});

router.post("/artists", async (req, res): Promise<void> => {
  const parsed = CreateArtistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const badLink = findInvalidLink(parsed.data.links);
  if (badLink) {
    res
      .status(400)
      .json({ error: `Invalid ${badLink} link — must start with https://` });
    return;
  }

  const [artist] = await db
    .insert(artistsTable)
    .values(parsed.data)
    .onConflictDoUpdate({
      target: artistsTable.email,
      set: {
        name: parsed.data.name,
        bio: parsed.data.bio,
        genre: parsed.data.genre,
        distributor: parsed.data.distributor,
        roles: parsed.data.roles,
        links: parsed.data.links,
      },
    })
    .returning();

  res.status(201).json(
    GetArtistResponse.parse({
      ...artist,
      createdAt: artist.createdAt.toISOString(),
      featuredSongId: artist.featuredSongId,
    })
  );
});

router.get("/artists/me", requireArtist, async (req, res): Promise<void> => {
  const artist = req.artist!;
  const profiles = await soundProfilesByArtist();
  res.json(
    GetArtistResponse.parse({
      ...artist,
      createdAt: artist.createdAt.toISOString(),
      soundProfile: profiles.get(artist.id) ?? null,
    })
  );
});

router.get("/artists/:id", async (req, res): Promise<void> => {
  const params = GetArtistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [artist] = await db
    .select()
    .from(artistsTable)
    .where(eq(artistsTable.id, params.data.id));

  if (!artist) {
    res.status(404).json({ error: "Artist not found" });
    return;
  }

  res.json(
    GetArtistResponse.parse({
      ...artist,
      createdAt: artist.createdAt.toISOString(),
      featuredSongId: artist.featuredSongId,
    })
  );
});

router.put("/artists/:id", requireArtist, async (req, res): Promise<void> => {
  const params = UpdateArtistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (params.data.id !== req.artist!.id) {
    res.status(403).json({ error: "You can only edit your own profile" });
    return;
  }
  const body = UpdateArtistBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const badLink = findInvalidLink(body.data.links);
  if (badLink) {
    res
      .status(400)
      .json({ error: `Invalid ${badLink} link — must start with https://` });
    return;
  }

  const updated = await db
    .update(artistsTable)
    .set({
      ...(body.data.name !== undefined ? { name: body.data.name } : {}),
      ...(body.data.bio !== undefined ? { bio: body.data.bio } : {}),
      ...(body.data.genre !== undefined ? { genre: body.data.genre } : {}),
      ...(body.data.distributor !== undefined
        ? { distributor: body.data.distributor }
        : {}),
      ...(body.data.roles !== undefined ? { roles: body.data.roles } : {}),
      ...(body.data.links !== undefined ? { links: body.data.links } : {}),
      ...(body.data.featuredSongId !== undefined
        ? { featuredSongId: body.data.featuredSongId }
        : {}),
    })
    .where(eq(artistsTable.id, params.data.id))
    .returning();

  if (updated.length === 0) {
    res.status(404).json({ error: "Artist not found" });
    return;
  }

  res.json(
    UpdateArtistResponse.parse({
      ...updated[0],
      createdAt: updated[0].createdAt.toISOString(),
      featuredSongId: updated[0].featuredSongId,
    })
  );
});

router.get(
  "/artists/:id/songs",
  requireArtist,
  async (req, res): Promise<void> => {
    const params = GetArtistSongsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (params.data.id !== req.artist!.id) {
      res.status(403).json({ error: "You can only view your own songs" });
      return;
    }

  const songs = await db
    .select({
      id: songsTable.id,
      title: songsTable.title,
      artistName: artistsTable.name,
      genre: songsTable.genre,
      releaseDate: songsTable.releaseDate,
      status: songsTable.status,
      coverColor: songsTable.coverColor,
      tags: songsTable.tags,
      audioUrl: songsTable.audioUrl,
      artworkUrl: songsTable.artworkUrl,
      durationSeconds: songsTable.durationSeconds,
      license: songsTable.license,
      analysis: songsTable.analysis,
    })
    .from(songsTable)
    .innerJoin(artistsTable, eq(songsTable.artistId, artistsTable.id))
    .where(eq(songsTable.artistId, params.data.id))
    .orderBy(desc(songsTable.createdAt));

  const today = new Date();
  const result = songs.map((s) => ({
    ...s,
    daysUntilRelease: Math.max(
      0,
      Math.ceil(
        (new Date(s.releaseDate).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    ),
    discoveredCount: null,
    skipCount: null,
  }));

  res.json(GetArtistSongsResponse.parse(result));
});

router.get(
  "/artists/:id/songstats",
  requireArtist,
  async (req, res): Promise<void> => {
    const params = GetArtistSongstatsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (params.data.id !== req.artist!.id) {
      res
        .status(403)
        .json({ error: "You can only view your own streaming stats" });
      return;
    }

    const songs = await db
      .select({
        id: songsTable.id,
        title: songsTable.title,
        coverColor: songsTable.coverColor,
        status: songsTable.status,
        streamingId: songsTable.streamingId,
        releaseDate: songsTable.releaseDate,
      })
      .from(songsTable)
      .where(eq(songsTable.artistId, params.data.id))
      .orderBy(desc(songsTable.createdAt));

    const fetchedAt = new Date().toISOString();

    if (songs.length === 0) {
      res.json(
        GetArtistSongstatsResponse.parse({
          status: "no_songs",
          configured: isConfigured(),
          songsTotal: 0,
          songsWithStats: 0,
          streamsTotal: null,
          playlistReachTotal: null,
          playlistsTotal: null,
          chartsTotal: null,
          platforms: [],
          songs: [],
          fetchedAt,
        })
      );
      return;
    }

    // A song counts as released once its release date has arrived (UTC, day
    // granularity) — mirrors the per-song /songs/:id/songstats gating so
    // pre-release songs never show live numbers even with an identifier.
    const todayUtc = new Date(new Date().toISOString().slice(0, 10)).getTime();

    const perSong = await Promise.all(
      songs.map(async (s) => {
        const releaseUtc = new Date(`${s.releaseDate}T00:00:00Z`).getTime();
        const released = Number.isFinite(releaseUtc)
          ? releaseUtc <= todayUtc
          : true;
        const stats = await getTrackStats(s.streamingId, { released });
        return { song: s, stats };
      })
    );

    // Aggregate platform totals across every song that returned live data.
    const platformAgg = new Map<
      string,
      {
        source: string;
        streamsTotal: number | null;
        playlistReachTotal: number | null;
        playlistsTotal: number | null;
        chartsTotal: number | null;
      }
    >();

    const addNullable = (a: number | null, b: number | null): number | null => {
      if (a === null && b === null) return null;
      return (a ?? 0) + (b ?? 0);
    };

    let streamsTotal: number | null = null;
    let playlistReachTotal: number | null = null;
    let playlistsTotal: number | null = null;
    let chartsTotal: number | null = null;
    let songsWithStats = 0;

    for (const { stats } of perSong) {
      if (!stats.available) continue;
      songsWithStats++;
      streamsTotal = addNullable(streamsTotal, stats.streamsTotal);
      playlistReachTotal = addNullable(
        playlistReachTotal,
        stats.playlistReachTotal
      );
      playlistsTotal = addNullable(playlistsTotal, stats.playlistsTotal);
      chartsTotal = addNullable(chartsTotal, stats.chartsTotal);

      for (const src of stats.sources) {
        const existing = platformAgg.get(src.source);
        const srcStreams = src.streamsTotal ?? src.playsTotal;
        if (existing) {
          existing.streamsTotal = addNullable(existing.streamsTotal, srcStreams);
          existing.playlistReachTotal = addNullable(
            existing.playlistReachTotal,
            src.playlistReachTotal
          );
          existing.playlistsTotal = addNullable(
            existing.playlistsTotal,
            src.playlistsTotal
          );
          existing.chartsTotal = addNullable(
            existing.chartsTotal,
            src.chartsTotal
          );
        } else {
          platformAgg.set(src.source, {
            source: src.source,
            streamsTotal: srcStreams,
            playlistReachTotal: src.playlistReachTotal,
            playlistsTotal: src.playlistsTotal,
            chartsTotal: src.chartsTotal,
          });
        }
      }
    }

    const platforms = Array.from(platformAgg.values()).sort(
      (a, b) => (b.streamsTotal ?? 0) - (a.streamsTotal ?? 0)
    );

    const configured = isConfigured();
    let status: "ok" | "unconfigured" | "no_data";
    if (songsWithStats > 0) {
      status = "ok";
    } else if (!configured) {
      status = "unconfigured";
    } else {
      status = "no_data";
    }

    res.json(
      GetArtistSongstatsResponse.parse({
        status,
        configured,
        songsTotal: songs.length,
        songsWithStats,
        streamsTotal,
        playlistReachTotal,
        playlistsTotal,
        chartsTotal,
        platforms,
        songs: perSong.map(({ song, stats }) => ({
          id: song.id,
          title: song.title,
          coverColor: song.coverColor,
          status: song.status,
          songstatsStatus: stats.status,
          available: stats.available,
          streamsTotal: stats.streamsTotal,
          playlistReachTotal: stats.playlistReachTotal,
          chartsTotal: stats.chartsTotal,
        })),
        fetchedAt,
      })
    );
  }
);

router.get(
  "/artists/:id/dashboard",
  requireArtist,
  async (req, res): Promise<void> => {
    const params = GetArtistDashboardParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (params.data.id !== req.artist!.id) {
      res.status(403).json({ error: "You can only view your own dashboard" });
      return;
    }

  const [artist] = await db
    .select({ featuredSongId: artistsTable.featuredSongId })
    .from(artistsTable)
    .where(eq(artistsTable.id, params.data.id));

  const artistSongs = await db
    .select({ id: songsTable.id, status: songsTable.status })
    .from(songsTable)
    .where(eq(songsTable.artistId, params.data.id));

  const songIds = artistSongs.map((s) => s.id);

  let totalDiscovered = 0;
  let totalSkipped = 0;
  let totalMomentMarks = 0;
  const uniqueListeners = new Set<number>();

  if (songIds.length > 0) {
    const reactions = await db
      .select({
        songId: reactionsTable.songId,
        type: reactionsTable.type,
        listenerId: reactionsTable.listenerId,
      })
      .from(reactionsTable)
      .where(
        songIds.length === 1
          ? eq(reactionsTable.songId, songIds[0])
          : undefined
      );

    const filteredReactions = reactions.filter((r) =>
      songIds.includes(r.songId)
    );
    filteredReactions.forEach((r) => {
      uniqueListeners.add(r.listenerId);
      if (r.type === "discovered") totalDiscovered++;
      else totalSkipped++;
    });

    const marks = await db
      .select({ cnt: count() })
      .from(momentMarksTable)
      .then((r) => r[0]?.cnt ?? 0);
    totalMomentMarks = marks;
  }

  const today = new Date();
  const recentSongs = await db
    .select({
      id: songsTable.id,
      title: songsTable.title,
      artistName: artistsTable.name,
      genre: songsTable.genre,
      releaseDate: songsTable.releaseDate,
      status: songsTable.status,
      coverColor: songsTable.coverColor,
      tags: songsTable.tags,
      audioUrl: songsTable.audioUrl,
      artworkUrl: songsTable.artworkUrl,
      durationSeconds: songsTable.durationSeconds,
      license: songsTable.license,
      analysis: songsTable.analysis,
    })
    .from(songsTable)
    .innerJoin(artistsTable, eq(songsTable.artistId, artistsTable.id))
    .where(eq(songsTable.artistId, params.data.id))
    .orderBy(desc(songsTable.createdAt))
    .limit(5);

  res.json(
    GetArtistDashboardResponse.parse({
      artistId: params.data.id,
      totalSongs: artistSongs.length,
      activeSongs: artistSongs.filter((s) => s.status === "active").length,
      totalListeners: uniqueListeners.size,
      totalDiscovered,
      totalSkipped,
      totalMomentMarks,
      featuredSongId: artist?.featuredSongId ?? null,
      recentSongs: recentSongs.map((s) => ({
        ...s,
        daysUntilRelease: Math.max(
          0,
          Math.ceil(
            (new Date(s.releaseDate).getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        ),
        discoveredCount: null,
        skipCount: null,
      })),
    })
  );
});

export default router;
