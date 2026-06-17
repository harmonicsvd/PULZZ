import { Router, type IRouter, type Request } from "express";
import { timingSafeEqual } from "node:crypto";
import { sweepProcessing } from "../lib/cyaniteSync";

const router: IRouter = Router();

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Verifies the callback is genuinely from Cyanite using the shared
 * `CYANITE_WEBHOOK_SECRET`. Cyanite has no documented payload-signing scheme, so
 * we authenticate via a secret token supplied on the registered webhook URL
 * (`?token=…`) or an equivalent header. When the secret is unset (local dev) we
 * accept, so the endpoint still works before the secret is configured.
 */
function isAuthorized(req: Request): boolean {
  const secret = process.env.CYANITE_WEBHOOK_SECRET;
  if (!secret) return true;
  const provided =
    (typeof req.query.token === "string" ? req.query.token : "") ||
    req.get("x-cyanite-secret") ||
    req.get("x-webhook-secret") ||
    (req.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "");
  return provided.length > 0 && safeEqual(provided, secret);
}

/**
 * Cyanite analysis-complete callbacks land here.
 * Registered webhook URL: https://pulzz.replit.app/api/cyanite/webhook?token=<CYANITE_WEBHOOK_SECRET>
 *
 * Cyanite only marks delivery successful when it receives a 2xx, so authorized
 * requests always acknowledge with 200 first. We don't depend on the exact
 * payload shape: any authenticated event simply triggers a sweep that re-queries
 * Cyanite for every song still marked `processing` and persists finished ones.
 */
router.post("/cyanite/webhook", (req, res) => {
  if (!isAuthorized(req)) {
    req.log.warn("Cyanite webhook: rejected unauthenticated request");
    res.status(401).json({ error: "unauthorized" });
    return;
  }
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
