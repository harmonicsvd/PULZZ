import { Router, type IRouter } from "express";
import {
  db,
  listenersTable,
  releaseSubscriptionsTable,
  songsTable,
  artistsTable,
} from "@workspace/db";
import { and, eq, inArray, isNull, isNotNull } from "drizzle-orm";
import {
  CreateListenerBody,
  GetListenerParams,
  GetListenerResponse,
  SubscribeReleaseParams,
  SubscribeReleaseBody,
  UnsubscribeReleaseParams,
  UnsubscribeReleaseResponse,
  GetReleaseNotificationsParams,
  GetReleaseNotificationsResponse,
  AckReleaseNotificationsParams,
  AckReleaseNotificationsBody,
  AckReleaseNotificationsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/listeners", async (req, res): Promise<void> => {
  const parsed = CreateListenerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [listener] = await db
    .insert(listenersTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(
    GetListenerResponse.parse({
      ...listener,
      createdAt: listener.createdAt.toISOString(),
    })
  );
});

router.get("/listeners/:id", async (req, res): Promise<void> => {
  const params = GetListenerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [listener] = await db
    .select()
    .from(listenersTable)
    .where(eq(listenersTable.id, params.data.id));

  if (!listener) {
    res.status(404).json({ error: "Listener not found" });
    return;
  }

  res.json(
    GetListenerResponse.parse({
      ...listener,
      createdAt: listener.createdAt.toISOString(),
    })
  );
});

// Opt a listener in to a release-day notification for a discovered song.
router.post(
  "/listeners/:id/release-subscriptions",
  async (req, res): Promise<void> => {
    const params = SubscribeReleaseParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const body = SubscribeReleaseBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    const listenerId = params.data.id;
    const songId = body.data.songId;

    const [listener] = await db
      .select({ id: listenersTable.id })
      .from(listenersTable)
      .where(eq(listenersTable.id, listenerId));
    if (!listener) {
      res.status(404).json({ error: "Listener not found" });
      return;
    }
    const [song] = await db
      .select({ id: songsTable.id })
      .from(songsTable)
      .where(eq(songsTable.id, songId));
    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }

    // Idempotent opt-in: existing row (even an already-notified one) is reused.
    const [sub] = await db
      .insert(releaseSubscriptionsTable)
      .values({ listenerId, songId })
      .onConflictDoNothing({
        target: [
          releaseSubscriptionsTable.listenerId,
          releaseSubscriptionsTable.songId,
        ],
      })
      .returning();

    const row =
      sub ??
      (await db
        .select()
        .from(releaseSubscriptionsTable)
        .where(
          and(
            eq(releaseSubscriptionsTable.listenerId, listenerId),
            eq(releaseSubscriptionsTable.songId, songId)
          )
        )
        .then((r) => r[0]));

    res.status(201).json({
      id: row.id,
      listenerId: row.listenerId,
      songId: row.songId,
      notifiedAt: row.notifiedAt ? row.notifiedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    });
  }
);

// Opt a listener out of a song's release-day notification (idempotent).
router.delete(
  "/listeners/:id/release-subscriptions/:songId",
  async (req, res): Promise<void> => {
    const params = UnsubscribeReleaseParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    await db
      .delete(releaseSubscriptionsTable)
      .where(
        and(
          eq(releaseSubscriptionsTable.listenerId, params.data.id),
          eq(releaseSubscriptionsTable.songId, params.data.songId)
        )
      );

    res.json(UnsubscribeReleaseResponse.parse({ ok: true }));
  }
);

// Pending release-day notifications: subscriptions whose song is now released
// and which have not yet been acknowledged.
router.get(
  "/listeners/:id/release-notifications",
  async (req, res): Promise<void> => {
    const params = GetReleaseNotificationsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const rows = await db
      .select({
        songId: songsTable.id,
        songTitle: songsTable.title,
        artistName: artistsTable.name,
        coverColor: songsTable.coverColor,
        artworkUrl: songsTable.artworkUrl,
        releasedAt: songsTable.releasedAt,
      })
      .from(releaseSubscriptionsTable)
      .innerJoin(
        songsTable,
        eq(releaseSubscriptionsTable.songId, songsTable.id)
      )
      .innerJoin(artistsTable, eq(songsTable.artistId, artistsTable.id))
      .where(
        and(
          eq(releaseSubscriptionsTable.listenerId, params.data.id),
          isNull(releaseSubscriptionsTable.notifiedAt),
          isNotNull(songsTable.releasedAt)
        )
      );

    res.json(
      GetReleaseNotificationsResponse.parse(
        rows.map((r) => ({
          songId: r.songId,
          songTitle: r.songTitle,
          artistName: r.artistName,
          coverColor: r.coverColor,
          artworkUrl: r.artworkUrl,
          releasedAt: r.releasedAt
            ? r.releasedAt.toISOString()
            : new Date().toISOString(),
        }))
      )
    );
  }
);

// Acknowledge delivered notifications so they are not shown again.
router.post(
  "/listeners/:id/release-notifications",
  async (req, res): Promise<void> => {
    const params = AckReleaseNotificationsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const body = AckReleaseNotificationsBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    if (body.data.songIds.length === 0) {
      res.json(AckReleaseNotificationsResponse.parse({ ok: true, count: 0 }));
      return;
    }

    const updated = await db
      .update(releaseSubscriptionsTable)
      .set({ notifiedAt: new Date() })
      .where(
        and(
          eq(releaseSubscriptionsTable.listenerId, params.data.id),
          inArray(releaseSubscriptionsTable.songId, body.data.songIds),
          isNull(releaseSubscriptionsTable.notifiedAt)
        )
      )
      .returning({ id: releaseSubscriptionsTable.id });

    res.json(
      AckReleaseNotificationsResponse.parse({ ok: true, count: updated.length })
    );
  }
);

export default router;
