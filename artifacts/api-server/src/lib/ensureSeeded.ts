import { count } from "drizzle-orm";
import { db, artistsTable } from "@workspace/db";
import { runSeed, artists, songs } from "./seedData";
import { logger } from "./logger";

/**
 * Runs the demo seed once if the database is empty.
 * Safe to call on every startup — it is a no-op when data already exists.
 */
export async function ensureSeeded(): Promise<void> {
  try {
    const [{ value }] = await db.select({ value: count() }).from(artistsTable);
    if (value > 0) {
      logger.info({ artists: value }, "Database already seeded, skipping auto-seed");
      return;
    }

    logger.info("Database is empty — running initial seed");
    await runSeed();
    logger.info(
      { artists: artists.length, songs: songs.length },
      "Auto-seed complete"
    );
  } catch (err) {
    logger.error({ err }, "Auto-seed failed — server will start anyway");
  }
}
