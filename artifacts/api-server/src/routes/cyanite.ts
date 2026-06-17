import { Router, type IRouter } from "express";

const router: IRouter = Router();

/**
 * Cyanite analysis-complete callbacks land here.
 * Registered webhook URL: https://pulzz.replit.app/api/cyanite/webhook
 *
 * Cyanite only marks delivery successful when it receives a 2xx, so this
 * always acknowledges with 200. Persisting the analysis (and verifying the
 * callback signature) is the next phase, once the Cyanite API key is added.
 */
router.post("/cyanite/webhook", (req, res) => {
  req.log.info({ event: req.body }, "Cyanite webhook event received");
  res.status(200).json({ received: true });
});

/** Readiness check (e.g. opening the webhook URL in a browser). */
router.get("/cyanite/webhook", (_req, res) => {
  res.status(200).json({ status: "ok", endpoint: "cyanite-webhook" });
});

export default router;
