import { count, inArray, isNull, and } from "drizzle-orm";
import { db, artistsTable, songsTable } from "@workspace/db";
import { runSeed, artists, songs } from "./seedData";
import { logger } from "./logger";

/**
 * Ensures the demo catalog is present and complete on startup.
 *
 * - If the database is empty, runs the full seed.
 * - If the demo songs already exist but are missing their Sound DNA
 *   (e.g. they were seeded by an older deploy that predated the
 *   cyanite/analysis fields), re-runs the idempotent seed to backfill.
 *
 * `runSeed()` UPSERTs the 5 demo songs in place, so this is safe to call on
 * every startup: it never deletes rows and never touches reactions/moments
 * (separate tables) or artist-submitted songs (different ids). Once the DNA is
 * backfilled the missing-data check is false, so it becomes a no-op.
 */
export async function ensureSeeded(): Promise<void> {
  try {
    const [{ value }] = await db.select({ value: count() }).from(artistsTable);

    if (value === 0) {
      logger.info("Database is empty — running initial seed");
      await runSeed();
      logger.info(
        { artists: artists.length, songs: songs.length },
        "Auto-seed complete"
      );
      return;
    }

    const demoIds = songs.map((s) => s.id);
    const missingDna = await db
      .select({ id: songsTable.id })
      .from(songsTable)
      .where(
        and(inArray(songsTable.id, demoIds), isNull(songsTable.cyaniteAnalysis))
      );

    if (missingDna.length > 0) {
      logger.info(
        { missing: missingDna.length },
        "Demo songs missing Sound DNA — re-running idempotent seed to backfill analysis"
      );
      await runSeed();
      logger.info("Demo analysis backfill complete");
      return;
    }

    logger.info(
      { artists: value },
      "Database already seeded and demo analysis present, skipping auto-seed"
    );
  } catch (err) {
    logger.error({ err }, "Auto-seed failed — server will start anyway");
  }
}
