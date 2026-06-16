import { Router, type IRouter } from "express";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { db, momentMarksTable, reactionsTable, songsTable, artistsTable } from "@workspace/db";
import {
  GetSongMomentsResponse,
  GetSongParams,
  GetSongReactionsParams,
  GetSongReactionsResponse,
  GetSongResponse,
  ListSongsQueryParams,
  ListSongsResponse,
  SubmitSongBody,
  UpdateSongAnalysisBody,
  UpdateSongAnalysisParams,
  UpdateSongAnalysisResponse,
  UpdateSongLyricsBody,
  UpdateSongLyricsParams,
  UpdateSongLyricsResponse,
} from "@workspace/api-zod";
import type { SongAnalysis } from "@workspace/db";
import { analyzeLyrics } from "../lib/musixmatch";

const router: IRouter = Router();

router.get("/songs", async (req, res): Promise<void> => {
  const query = ListSongsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.status) conditions.push(eq(songsTable.status, query.data.status));
  if (query.data.genre) conditions.push(eq(songsTable.genre, query.data.genre));

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
    })
    .from(songsTable)
    .innerJoin(artistsTable, eq(songsTable.artistId, artistsTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
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

  res.json(ListSongsResponse.parse(result));
});

router.post("/songs", async (req, res): Promise<void> => {
  const parsed = SubmitSongBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { artistId, releaseDate, ...rest } = parsed.data;

  let analysis: SongAnalysis | null = null;
  if (rest.lyrics && rest.lyrics.trim().length > 0) {
    try {
      const query = [rest.title, rest.lyrics.split("\n")[0]?.trim()]
        .filter(Boolean)
        .join(" ");
      const derived = await analyzeLyrics(query, rest.lyrics);
      analysis = {
        mood: derived.mood,
        themes: derived.themes,
        ...(derived.language ? { language: derived.language } : {}),
      };
    } catch (err) {
      req.log.error({ err }, "Lyrics analysis failed during song submission");
      analysis = null;
    }
  }

  const [song] = await db
    .insert(songsTable)
    .values({
      artistId,
      releaseDate,
      ...rest,
      analysis,
    })
    .returning();

  const artist = await db
    .select({ name: artistsTable.name })
    .from(artistsTable)
    .where(eq(artistsTable.id, artistId))
    .then((r) => r[0]);

  const today = new Date();
  res.status(201).json(
    ListSongsResponse.element.parse({
      ...song,
      artistName: artist?.name ?? "",
      daysUntilRelease: Math.max(
        0,
        Math.ceil(
          (new Date(song.releaseDate).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ),
      discoveredCount: null,
      skipCount: null,
    })
  );
});

router.get("/songs/:id", async (req, res): Promise<void> => {
  const params = GetSongParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [song] = await db
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
      story: songsTable.story,
      lyrics: songsTable.lyrics,
      lrc: songsTable.lrc,
      credits: songsTable.credits,
      analysis: songsTable.analysis,
      license: songsTable.license,
      instruments: songsTable.instruments,
      isrc: songsTable.isrc,
    })
    .from(songsTable)
    .innerJoin(artistsTable, eq(songsTable.artistId, artistsTable.id))
    .where(eq(songsTable.id, params.data.id));

  if (!song) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  const reactionCounts = await db
    .select({ type: reactionsTable.type, cnt: count() })
    .from(reactionsTable)
    .where(eq(reactionsTable.songId, params.data.id))
    .groupBy(reactionsTable.type);

  const momentCount = await db
    .select({ cnt: count() })
    .from(momentMarksTable)
    .where(eq(momentMarksTable.songId, params.data.id))
    .then((r) => r[0]?.cnt ?? 0);

  const discovered = reactionCounts.find((r) => r.type === "discovered")?.cnt ?? 0;
  const skip = reactionCounts.find((r) => r.type === "skip")?.cnt ?? 0;

  const today = new Date();
  res.json(
    GetSongResponse.parse({
      ...song,
      daysUntilRelease: Math.max(
        0,
        Math.ceil(
          (new Date(song.releaseDate).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ),
      discoveredCount: discovered,
      skipCount: skip,
      momentCount,
    })
  );
});

router.put("/songs/:id/lyrics", async (req, res): Promise<void> => {
  const params = UpdateSongLyricsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateSongLyricsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updated = await db
    .update(songsTable)
    .set({ lrc: body.data.lrc })
    .where(eq(songsTable.id, params.data.id))
    .returning({ id: songsTable.id, lrc: songsTable.lrc });

  if (updated.length === 0) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  res.json(
    UpdateSongLyricsResponse.parse({ ok: true, lrc: updated[0].lrc ?? "" })
  );
});

router.put("/songs/:id/analysis", async (req, res): Promise<void> => {
  const params = UpdateSongAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateSongAnalysisBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const language = body.data.language?.trim();
  const analysis: SongAnalysis = {
    mood: body.data.mood,
    themes: body.data.themes,
    ...(language ? { language } : {}),
  };

  const updated = await db
    .update(songsTable)
    .set({ analysis })
    .where(eq(songsTable.id, params.data.id))
    .returning({ id: songsTable.id, analysis: songsTable.analysis });

  if (updated.length === 0) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  res.json(
    UpdateSongAnalysisResponse.parse({
      ok: true,
      analysis: updated[0].analysis ?? { mood: [], themes: [] },
    })
  );
});

router.get("/songs/:id/reactions", async (req, res): Promise<void> => {
  const params = GetSongReactionsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const reactionCounts = await db
    .select({ type: reactionsTable.type, cnt: count() })
    .from(reactionsTable)
    .where(eq(reactionsTable.songId, params.data.id))
    .groupBy(reactionsTable.type);

  const discovered = reactionCounts.find((r) => r.type === "discovered")?.cnt ?? 0;
  const skip = reactionCounts.find((r) => r.type === "skip")?.cnt ?? 0;
  const total = discovered + skip;

  const topMoments = await db
    .select({
      timestampMs: sql<number>`(${momentMarksTable.timestampMs} / 5000) * 5000`,
      count: count(),
    })
    .from(momentMarksTable)
    .where(eq(momentMarksTable.songId, params.data.id))
    .groupBy(sql`(${momentMarksTable.timestampMs} / 5000) * 5000`)
    .orderBy(desc(count()))
    .limit(10);

  res.json(
    GetSongReactionsResponse.parse({
      songId: params.data.id,
      discoveredCount: discovered,
      skipCount: skip,
      totalListeners: total,
      topMoments: topMoments.map((m) => ({
        timestampMs: m.timestampMs,
        count: m.count,
      })),
    })
  );
});

router.get("/songs/:id/moments", async (req, res): Promise<void> => {
  const params = GetSongReactionsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const marks = await db
    .select()
    .from(momentMarksTable)
    .where(eq(momentMarksTable.songId, params.data.id))
    .orderBy(momentMarksTable.timestampMs);

  res.json(
    GetSongMomentsResponse.parse(
      marks.map((m) => ({
        id: m.id,
        songId: m.songId,
        listenerId: m.listenerId,
        timestampMs: m.timestampMs,
        createdAt: m.createdAt.toISOString(),
      }))
    )
  );
});

export default router;
