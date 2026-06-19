import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, artistsTable, songsTable, type Artist } from "@workspace/db";
import { eq } from "drizzle-orm";
import { DEMO_ARTIST_ID } from "../lib/demoArtist";

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      artist?: Artist;
    }
  }
}

/**
 * Resolves the Clerk-authenticated user to a Pulzz artist row, attaching it as
 * `req.artist`. The artist account is provisioned just-in-time on first sign-in:
 * we look it up by `clerkUserId`, and if absent create (or link, by email) an
 * artist row from the Clerk user's profile. Every artist-scoped endpoint runs
 * this so the rest of the handler can trust `req.artist.id` as the caller's
 * identity rather than a client-supplied id.
 */
export async function requireArtist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existing = await db
      .select()
      .from(artistsTable)
      .where(eq(artistsTable.clerkUserId, userId));

    let artist = existing[0];

    if (!artist) {
      const user = await clerkClient.users.getUser(userId);
      const email =
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses?.[0]?.emailAddress ??
        `${userId}@artist.pulzz`;
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.username ||
        email.split("@")[0];

      // Insert a fresh artist, or link this Clerk user to an existing row that
      // already owns this email (so a seeded artist can be claimed once).
      const inserted = await db
        .insert(artistsTable)
        .values({ name, email, clerkUserId: userId })
        .onConflictDoUpdate({
          target: artistsTable.email,
          set: { clerkUserId: userId },
        })
        .returning();
      artist = inserted[0];
    }

    // The shared public demo artist is preview-only: anyone can sign in as it
    // via the one-click demo button, so block any mutation to prevent vandalism
    // or data poisoning of the dashboard everyone sees. Reads still work.
    if (artist.id === DEMO_ARTIST_ID && !READ_METHODS.has(req.method)) {
      res.status(403).json({ error: "The demo account is read-only." });
      return;
    }

    req.artist = artist;
    next();
  } catch (err) {
    req.log.error({ err }, "requireArtist failed to resolve the caller");
    res.status(500).json({ error: "Failed to resolve artist identity" });
  }
}

/**
 * Guards a `/songs/:id/*` route so only the song's owning artist may mutate it.
 * Must run after `requireArtist`. Returns 404 for unknown songs and 403 when the
 * signed-in artist does not own the song.
 */
export function requireSongOwnership(paramName = "id") {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const artist = req.artist;
    if (!artist) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const songId = Number(req.params[paramName]);
    if (!Number.isInteger(songId) || songId <= 0) {
      res.status(400).json({ error: "Invalid song id" });
      return;
    }

    const rows = await db
      .select({ artistId: songsTable.artistId })
      .from(songsTable)
      .where(eq(songsTable.id, songId));

    if (rows.length === 0) {
      res.status(404).json({ error: "Song not found" });
      return;
    }
    if (rows[0].artistId !== artist.id) {
      res.status(403).json({ error: "You do not own this song" });
      return;
    }

    next();
  };
}
