import { Router, type IRouter } from "express";
import { count, desc, eq } from "drizzle-orm";
import {
  db,
  artistsTable,
  songsTable,
  reactionsTable,
  momentMarksTable,
  listenersTable,
} from "@workspace/db";
import {
  CreateArtistBody,
  GetArtistDashboardParams,
  GetArtistDashboardResponse,
  GetArtistParams,
  GetArtistResponse,
  GetArtistSongsParams,
  GetArtistSongsResponse,
  ListArtistsResponse,
  UpdateArtistBody,
  UpdateArtistParams,
  UpdateArtistResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const URL_RE = /^https?:\/\/.+/;

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
  const artists = await db
    .select()
    .from(artistsTable)
    .orderBy(artistsTable.name);

  res.json(
    ListArtistsResponse.parse(
      artists.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
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
    })
  );
});

router.put("/artists/:id", async (req, res): Promise<void> => {
  const params = UpdateArtistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
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
    })
  );
});

router.get("/artists/:id/songs", async (req, res): Promise<void> => {
  const params = GetArtistSongsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
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

router.get("/artists/:id/dashboard", async (req, res): Promise<void> => {
  const params = GetArtistDashboardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

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
