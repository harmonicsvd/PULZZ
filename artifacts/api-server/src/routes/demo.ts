import { Router, type IRouter } from "express";
import { createDemoSignInTicket } from "../lib/demoArtist";

const router: IRouter = Router();

/**
 * Mints a short-lived Clerk sign-in ticket for the shared public demo artist so
 * visitors can preview the dashboard in one click. Intentionally unauthenticated
 * — the ticket only ever grants access to the seeded demo account.
 */
router.post("/demo-session", async (req, res) => {
  try {
    const ticket = await createDemoSignInTicket();
    res.status(201).json({ ticket });
  } catch (err) {
    req.log.error({ err }, "failed to mint demo sign-in ticket");
    res.status(503).json({ error: "Demo sign-in is not available" });
  }
});

export default router;
