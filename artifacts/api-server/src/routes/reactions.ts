import { Router, type IRouter } from "express";
import { db, reactionsTable, listenersTable, songsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CreateReactionBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/reactions", async (req, res): Promise<void> => {
  const parsed = CreateReactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(reactionsTable)
    .where(
      sql`${reactionsTable.songId} = ${parsed.data.songId} AND ${reactionsTable.listenerId} = ${parsed.data.listenerId}`
    )
    .then((r) => r[0]);

  let reaction;
  if (existing) {
    [reaction] = await db
      .update(reactionsTable)
      .set({ type: parsed.data.type })
      .where(eq(reactionsTable.id, existing.id))
      .returning();
  } else {
    [reaction] = await db
      .insert(reactionsTable)
      .values(parsed.data)
      .returning();
  }

  if (parsed.data.type === "discovered") {
    await db
      .update(listenersTable)
      .set({
        discoveryCount: sql`${listenersTable.discoveryCount} + 1`,
        points: sql`${listenersTable.points} + 100`,
      })
      .where(eq(listenersTable.id, parsed.data.listenerId));
  }

  res.status(201).json({
    id: reaction.id,
    songId: reaction.songId,
    listenerId: reaction.listenerId,
    type: reaction.type,
    createdAt: reaction.createdAt.toISOString(),
  });
});

export default router;
