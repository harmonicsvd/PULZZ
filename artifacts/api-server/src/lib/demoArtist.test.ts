import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Unit tests for the one-click demo provisioning logic in `demoArtist.ts`.
 *
 * The Clerk admin API is exercised entirely through a stubbed global `fetch`,
 * and the Drizzle `db` is mocked, so these tests run with no live network or
 * database. They lock in the behavior that broke in production (create-user must
 * carry a password) plus the idempotency, duplicate-email race, and demo-artist
 * linkage guarantees.
 */

type ArtistRow = { id: number; clerkUserId: string | null };

type UpdateOp = {
  set?: Record<string, unknown>;
  where?: { col?: string; val?: unknown };
};

const dbState: { artists: ArtistRow[]; updates: UpdateOp[] } = {
  artists: [],
  updates: [],
};

// Mock drizzle's `eq` so we can introspect which column/value an update targets
// (used to assert the link hits DEMO_ARTIST_ID). Everything else is passthrough.
vi.mock("drizzle-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("drizzle-orm")>();
  return {
    ...actual,
    eq: (col: unknown, val: unknown) => ({ col, val }),
  };
});

vi.mock("@workspace/db", () => {
  const db = {
    update: () => {
      const op: UpdateOp = {};
      const chain = {
        set: (values: Record<string, unknown>) => {
          op.set = values;
          dbState.updates.push(op);
          return chain;
        },
        where: (cond: { col?: string; val?: unknown }) => {
          op.where = cond;
          return {
            returning: () =>
              Promise.resolve(
                dbState.artists.filter((a) => a.id === cond?.val),
              ),
            then: (
              onF: (v: undefined) => unknown,
              onR?: (e: unknown) => unknown,
            ) => Promise.resolve(undefined).then(onF, onR),
          };
        },
      };
      return chain;
    },
  };
  return {
    db,
    artistsTable: { id: "artists.id", clerkUserId: "artists.clerkUserId" },
  };
});

type FetchResponse = { ok: boolean; status: number; body: unknown };

const clerkState = {
  existingUserId: null as string | null,
  createBehavior: "ok" as "ok" | "duplicate" | "error",
  createdUserId: "user_created",
  postUsersBodies: [] as Array<Record<string, unknown>>,
  signInTokenBodies: [] as Array<Record<string, unknown>>,
  findCalls: 0,
};

function handle(url: string, init?: { method?: string; body?: string }): FetchResponse {
  const method = init?.method ?? "GET";

  if (url.includes("/users?email_address=")) {
    clerkState.findCalls++;
    return {
      ok: true,
      status: 200,
      body: clerkState.existingUserId
        ? [{ id: clerkState.existingUserId }]
        : [],
    };
  }

  if (url.endsWith("/users") && method === "POST") {
    clerkState.postUsersBodies.push(JSON.parse(init!.body!));
    if (clerkState.createBehavior === "duplicate") {
      // A concurrent first-hit already created the user; the loser sees it now.
      clerkState.existingUserId = clerkState.createdUserId;
      return {
        ok: false,
        status: 422,
        body: { errors: [{ code: "form_identifier_exists" }] },
      };
    }
    if (clerkState.createBehavior === "error") {
      return { ok: false, status: 500, body: { error: "boom" } };
    }
    clerkState.existingUserId = clerkState.createdUserId;
    return { ok: true, status: 200, body: { id: clerkState.createdUserId } };
  }

  if (url.endsWith("/sign_in_tokens") && method === "POST") {
    clerkState.signInTokenBodies.push(JSON.parse(init!.body!));
    return { ok: true, status: 200, body: { token: "ticket_abc" } };
  }

  throw new Error(`unexpected fetch ${method} ${url}`);
}

const fetchMock = vi.fn(
  async (url: string, init?: { method?: string; body?: string }) => {
    const r = handle(url, init);
    return {
      ok: r.ok,
      status: r.status,
      text: async () => (r.body == null ? "" : JSON.stringify(r.body)),
    } as unknown as Response;
  },
);

import { createDemoSignInTicket, DEMO_ARTIST_ID, DEMO_EMAIL } from "./demoArtist";

beforeEach(() => {
  dbState.artists = [{ id: DEMO_ARTIST_ID, clerkUserId: null }];
  dbState.updates = [];
  clerkState.existingUserId = null;
  clerkState.createBehavior = "ok";
  clerkState.createdUserId = "user_created";
  clerkState.postUsersBodies = [];
  clerkState.signInTokenBodies = [];
  clerkState.findCalls = 0;
  process.env.CLERK_SECRET_KEY = "sk_test_demo";
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("createDemoSignInTicket provisioning", () => {
  it("creates the demo user with a non-empty password when none exists", async () => {
    const ticket = await createDemoSignInTicket();

    expect(ticket).toBe("ticket_abc");
    expect(clerkState.postUsersBodies).toHaveLength(1);
    const body = clerkState.postUsersBodies[0];
    expect(body.email_address).toEqual([DEMO_EMAIL]);
    expect(typeof body.password).toBe("string");
    expect((body.password as string).length).toBeGreaterThan(0);
  });

  it("is idempotent: reuses an existing user and never creates a duplicate", async () => {
    clerkState.existingUserId = "user_existing";

    const first = await createDemoSignInTicket();
    const second = await createDemoSignInTicket();

    expect(first).toBe("ticket_abc");
    expect(second).toBe("ticket_abc");
    // Never POST /users when the demo user already exists.
    expect(clerkState.postUsersBodies).toHaveLength(0);
    expect(clerkState.signInTokenBodies).toHaveLength(2);
  });

  it("recovers from a duplicate-email race by re-querying the user", async () => {
    clerkState.createBehavior = "duplicate";

    const ticket = await createDemoSignInTicket();

    expect(ticket).toBe("ticket_abc");
    // It attempted to create once, hit the duplicate, then re-queried.
    expect(clerkState.postUsersBodies).toHaveLength(1);
    expect(clerkState.findCalls).toBe(2);
    // The minted token belongs to the user found on re-query.
    expect(clerkState.signInTokenBodies[0].user_id).toBe(
      clerkState.createdUserId,
    );
  });

  it("surfaces the original error when create fails and re-query finds nothing", async () => {
    clerkState.createBehavior = "error";

    await expect(createDemoSignInTicket()).rejects.toThrow(/Clerk POST/);
    expect(clerkState.signInTokenBodies).toHaveLength(0);
  });

  it("links the demo Clerk user to the seeded demo artist row", async () => {
    await createDemoSignInTicket();

    const link = dbState.updates.find((u) => u.where?.col === "artists.id");
    expect(link).toBeTruthy();
    expect(link!.where!.val).toBe(DEMO_ARTIST_ID);
    expect(link!.set!.clerkUserId).toBe(clerkState.createdUserId);

    // The minted sign-in token targets that same linked user.
    expect(clerkState.signInTokenBodies[0].user_id).toBe(
      clerkState.createdUserId,
    );
  });

  it("clears any stale link before re-linking to avoid a unique-constraint collision", async () => {
    await createDemoSignInTicket();

    const clear = dbState.updates.find(
      (u) => u.where?.col === "artists.clerkUserId",
    );
    expect(clear).toBeTruthy();
    expect(clear!.set!.clerkUserId).toBeNull();
  });

  it("throws when the demo artist row is missing (seed not run)", async () => {
    dbState.artists = [];

    await expect(createDemoSignInTicket()).rejects.toThrow(/not found/);
    // Must not mint a ticket if linkage failed.
    expect(clerkState.signInTokenBodies).toHaveLength(0);
  });

  it("throws when CLERK_SECRET_KEY is missing", async () => {
    delete process.env.CLERK_SECRET_KEY;

    await expect(createDemoSignInTicket()).rejects.toThrow(
      /CLERK_SECRET_KEY/,
    );
  });
});
