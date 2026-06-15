import { Router, type IRouter } from "express";
import { db, listenersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateListenerBody, GetListenerParams, GetListenerResponse } from "@workspace/api-zod";

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

export default router;
