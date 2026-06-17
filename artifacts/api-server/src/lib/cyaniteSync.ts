import { and, eq, isNotNull } from "drizzle-orm";
import { db, songsTable, type CyaniteAnalysis } from "@workspace/db";
import { logger } from "./logger";
import {
  type CyaniteStatus,
  fetchAnalysis,
  isConfigured,
  requestAnalysis,
} from "./cyanite";

export interface SoundAnalysisState {
  status: CyaniteStatus | "not_started";
  trackId: string | null;
  analysis: CyaniteAnalysis | null;
}

/**
 * Kicks off a Cyanite analysis for a song in the background (upload + create is
 * too slow to block a request on). Persists the returned library-track id and
 * status so the webhook sweep / lazy fetch can later store the finished result.
 */
export function startSongAnalysis(
  songId: number,
  audioUrl: string,
  title: string
): void {
  if (!isConfigured()) return;
  void (async () => {
    try {
      const { status, libraryTrackId } = await requestAnalysis(audioUrl, {
        title,
        externalId: String(songId),
      });
      await db
        .update(songsTable)
        .set({ cyaniteTrackId: libraryTrackId, cyaniteStatus: status })
        .where(eq(songsTable.id, songId));
      logger.info(
        { songId, libraryTrackId, status },
        "Cyanite analysis requested"
      );
    } catch (err) {
      logger.error({ err, songId }, "Cyanite analysis request failed");
    }
  })();
}

/**
 * Reads the latest analysis for a single song. If it's still processing and has
 * a Cyanite track id, it re-queries Cyanite and persists a finished/failed
 * result in place.
 */
export async function syncSong(songId: number): Promise<SoundAnalysisState> {
  const [song] = await db
    .select({
      cyaniteTrackId: songsTable.cyaniteTrackId,
      cyaniteStatus: songsTable.cyaniteStatus,
      cyaniteAnalysis: songsTable.cyaniteAnalysis,
    })
    .from(songsTable)
    .where(eq(songsTable.id, songId));

  if (!song) {
    return { status: "not_started", trackId: null, analysis: null };
  }

  const status = (song.cyaniteStatus as CyaniteStatus | null) ?? "not_started";

  // Already terminal — return what we have.
  if (status === "finished" || status === "failed") {
    return {
      status,
      trackId: song.cyaniteTrackId,
      analysis: song.cyaniteAnalysis ?? null,
    };
  }

  // Processing (or stale) with a track id: poll Cyanite for the result.
  if (song.cyaniteTrackId) {
    const fresh = await fetchAnalysis(song.cyaniteTrackId);
    if (fresh.status === "finished" && fresh.analysis) {
      await db
        .update(songsTable)
        .set({ cyaniteStatus: "finished", cyaniteAnalysis: fresh.analysis })
        .where(eq(songsTable.id, songId));
      return {
        status: "finished",
        trackId: song.cyaniteTrackId,
        analysis: fresh.analysis,
      };
    }
    if (fresh.status === "failed") {
      await db
        .update(songsTable)
        .set({ cyaniteStatus: "failed" })
        .where(eq(songsTable.id, songId));
      return { status: "failed", trackId: song.cyaniteTrackId, analysis: null };
    }
    return {
      status: fresh.status,
      trackId: song.cyaniteTrackId,
      analysis: null,
    };
  }

  return {
    status,
    trackId: song.cyaniteTrackId,
    analysis: song.cyaniteAnalysis ?? null,
  };
}

/**
 * Re-queries Cyanite for every song still marked `processing` and persists any
 * that have finished. Triggered by inbound Cyanite webhooks (whose exact payload
 * shape we don't depend on) so results land without polling.
 */
export async function sweepProcessing(): Promise<number> {
  if (!isConfigured()) return 0;
  const pending = await db
    .select({ id: songsTable.id })
    .from(songsTable)
    .where(
      and(
        eq(songsTable.cyaniteStatus, "processing"),
        isNotNull(songsTable.cyaniteTrackId)
      )
    );

  let updated = 0;
  for (const { id } of pending) {
    try {
      const state = await syncSong(id);
      if (state.status === "finished") updated += 1;
    } catch (err) {
      logger.error({ err, songId: id }, "Cyanite sweep: syncSong failed");
    }
  }
  if (pending.length > 0) {
    logger.info({ checked: pending.length, updated }, "Cyanite sweep complete");
  }
  return updated;
}
