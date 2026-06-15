import { Router, type IRouter } from "express";
import { db, momentMarksTable } from "@workspace/db";
import { CreateMomentMarkBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/moment-marks", async (req, res): Promise<void> => {
  const parsed = CreateMomentMarkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [mark] = await db
    .insert(momentMarksTable)
    .values(parsed.data)
    .returning();

  res.status(201).json({
    id: mark.id,
    songId: mark.songId,
    listenerId: mark.listenerId,
    timestampMs: mark.timestampMs,
    createdAt: mark.createdAt.toISOString(),
  });
});

export default router;
