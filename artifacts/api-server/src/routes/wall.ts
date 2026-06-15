import { Router, type IRouter } from "express";
import { db, listenersTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { GetWallResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/wall", async (_req, res): Promise<void> => {
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
