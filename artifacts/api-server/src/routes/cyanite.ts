import { Router, type IRouter } from "express";
import { sweepProcessing } from "../lib/cyaniteSync";

const router: IRouter = Router();

/**
 * Cyanite analysis-complete callbacks land here.
 * Registered webhook URL: https://pulzz.replit.app/api/cyanite/webhook
 *
 * Cyanite only marks delivery successful when it receives a 2xx, so this
 * always acknowledges with 200 first. We don't depend on the exact payload
 * shape: any event simply triggers a sweep that re-queries Cyanite for every
 * song still marked `processing` and persists the ones that have finished.
 */
router.post("/cyanite/webhook", (req, res) => {
  req.log.info({ event: req.body }, "Cyanite webhook event received");
  res.status(200).json({ received: true });
  void sweepProcessing().catch((err) =>
    req.log.error({ err }, "Cyanite webhook sweep failed")
  );
});

/** Readiness check (e.g. opening the webhook URL in a browser). */
router.get("/cyanite/webhook", (_req, res) => {
  res.status(200).json({ status: "ok", endpoint: "cyanite-webhook" });
});

export default router;
