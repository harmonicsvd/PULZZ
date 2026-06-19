import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, artistsTable } from "@workspace/db";

// A single, shared, public demo artist account so judges (or anyone) can preview
// the artist dashboard in one click without creating an account. The frontend
// "View demo dashboard" button exchanges a short-lived sign-in ticket minted
// here for this user — no password or email verification involved, so it works
// regardless of which sign-in strategies the Clerk instance has enabled.
export const DEMO_EMAIL = "demo.artist@pulzz.app";

// The seeded artist the demo account maps to. Artist 1 (Ernestine
// Schumann-Heink / "Danny Boy") already has reactions, so its dashboard is
// populated and makes for a convincing preview.
export const DEMO_ARTIST_ID = 1;

const CLERK_API = "https://api.clerk.com/v1";

// Sign-in tickets are single-use and intentionally short-lived; this is just
// enough time for the browser to exchange it after the button is clicked.
const TICKET_TTL_SECONDS = 120;

function secret(): string {
  const key = process.env.CLERK_SECRET_KEY;
  if (!key || key.trim().length === 0) {
    throw new Error("CLERK_SECRET_KEY is not set");
  }
  return key.trim();
}

async function clerk<T>(
  path: string,
  init?: { method?: string; body?: string },
): Promise<T> {
  const res = await fetch(`${CLERK_API}${path}`, {
    method: init?.method ?? "GET",
    body: init?.body,
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Clerk ${init?.method ?? "GET"} ${path} failed: ${res.status} ${text}`,
    );
  }
  return (text ? JSON.parse(text) : null) as T;
}

async function findUserId(): Promise<string | null> {
  const list = await clerk<Array<{ id: string }>>(
    `/users?email_address=${encodeURIComponent(DEMO_EMAIL)}`,
  );
  return Array.isArray(list) && list.length > 0 ? list[0].id : null;
}

/**
 * Find-or-create the shared demo Clerk user and link it to the populated demo
 * artist row. Idempotent and self-healing, so the demo works in any environment
 * (dev or production) without a manual seed step. Returns the Clerk user id.
 */
async function provisionDemoUserId(): Promise<string> {
  let userId = await findUserId();

  if (!userId) {
    try {
      // The production Clerk instance enforces a password requirement on
      // created users, so supply a strong random one. It's never surfaced or
      // used by anyone — the demo signs in exclusively via the short-lived
      // ticket strategy — it only exists to satisfy create-user validation.
      const created = await clerk<{ id: string }>(`/users`, {
        method: "POST",
        body: JSON.stringify({
          email_address: [DEMO_EMAIL],
          password: randomBytes(24).toString("base64url"),
        }),
      });
      userId = created.id;
    } catch (err) {
      // Two near-simultaneous first hits can race to create the same user; the
      // loser gets a duplicate-email error. Re-query and continue if the user
      // now exists, otherwise surface the original failure.
      userId = await findUserId();
      if (!userId) throw err;
    }
  }

  // Link the demo Clerk user to the populated demo artist. Clear any stale link
  // first so the unique clerk_user_id constraint can't collide.
  await db
    .update(artistsTable)
    .set({ clerkUserId: null })
    .where(eq(artistsTable.clerkUserId, userId));

  const linked = await db
    .update(artistsTable)
    .set({ clerkUserId: userId })
    .where(eq(artistsTable.id, DEMO_ARTIST_ID))
    .returning();

  if (linked.length === 0) {
    throw new Error(
      `Demo artist id ${DEMO_ARTIST_ID} not found — run the seed first (pnpm --filter @workspace/api-server run seed)`,
    );
  }

  return userId;
}

/**
 * Provision the demo account (if needed) and mint a fresh single-use Clerk
 * sign-in ticket the browser can exchange via the `ticket` sign-in strategy.
 */
export async function createDemoSignInTicket(): Promise<string> {
  const userId = await provisionDemoUserId();

  const token = await clerk<{ token: string }>(`/sign_in_tokens`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      expires_in_seconds: TICKET_TTL_SECONDS,
    }),
  });

  return token.token;
}
