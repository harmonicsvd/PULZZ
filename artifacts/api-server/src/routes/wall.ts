import { Router, type IRouter } from "express";
import {
  db,
  listenersTable,
  reactionsTable,
  songsTable,
} from "@workspace/db";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { GetWallResponse, GetWallQueryParams } from "@workspace/api-zod";
import { requireArtist } from "../middlewares/auth";

const router: IRouter = Router();

const POINTS_PER_DISCOVERY = 100;

router.get("/wall", requireArtist, async (req, res): Promise<void> => {
  const query = GetWallQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  // An authenticated artist may only request the leaderboard scoped to their
  // own songs.
  if (
    query.data.artistId !== undefined &&
    query.data.artistId !== req.artist!.id
  ) {
    res.status(403).json({ error: "You can only view your own wall" });
    return;
  }

  // Per-artist leaderboard: rank only listeners who have discovered one of this
  // artist's songs, scored by how many of them they discovered.
  if (query.data.artistId !== undefined) {
    const rows = await db
      .select({
        listenerId: reactionsTable.listenerId,
        listenerName: listenersTable.name,
        discoveryCount: count(),
      })
      .from(reactionsTable)
      .innerJoin(songsTable, eq(reactionsTable.songId, songsTable.id))
      .innerJoin(
        listenersTable,
        eq(reactionsTable.listenerId, listenersTable.id)
      )
      .where(
        and(
          eq(reactionsTable.type, "discovered"),
          eq(songsTable.artistId, query.data.artistId)
        )
      )
      .groupBy(reactionsTable.listenerId, listenersTable.name)
      .orderBy(desc(count()))
      .limit(50);

    const result = rows.map((r, i) => {
      const points = r.discoveryCount * POINTS_PER_DISCOVERY;
      return {
        rank: i + 1,
        listenerId: r.listenerId,
        listenerName: r.listenerName,
        discoveryCount: r.discoveryCount,
        points,
        badges: getBadges(r.discoveryCount, points),
      };
    });

    res.json(GetWallResponse.parse(result));
    return;
  }

  // Global leaderboard: all listeners ranked by lifetime points.
  const listeners = await db
    .select()
    .from(listenersTable)
    .orderBy(desc(listenersTable.points))
    .limit(50);

  const result = listeners.map((l, i) => ({
    rank: i + 1,
    listenerId: l.id,
    listenerName: l.name,
    discoveryCount: l.discoveryCount,
    points: l.points,
    badges: getBadges(l.discoveryCount, l.points),
  }));

  res.json(GetWallResponse.parse(result));
});

function getBadges(discoveries: number, points: number): string[] {
  const badges: string[] = [];
  if (discoveries >= 50) badges.push("Legend");
  else if (discoveries >= 20) badges.push("Elite");
  else if (discoveries >= 10) badges.push("Pioneer");
  if (points >= 5000) badges.push("High Score");
  return badges;
}

export default router;
