import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express, { type Express } from "express";
import request from "supertest";
import type { CyaniteAnalysis } from "@workspace/db";

/**
 * Route-level tests for PUT /songs/:id/sound-analysis. They lock in the merge
 * behavior: a partial payload must preserve untouched scalar fields and the
 * AI-derived genre/mood distributions, while an explicit null clears a field.
 *
 * The Drizzle `db` is mocked so we can seed an existing analysis and capture the
 * exact payload written back via `.set()`.
 */

type SongRow = { id: number; cyaniteAnalysis: CyaniteAnalysis | null };

const dbState: {
  songRows: SongRow[];
  captured: Record<string, unknown> | null;
} = { songRows: [], captured: null };

vi.mock("@workspace/db", () => {
  const db = {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve(dbState.songRows),
      }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => {
        dbState.captured = values;
        return { where: () => Promise.resolve(undefined) };
      },
    }),
  };
  return {
    db,
    songsTable: {},
    artistsTable: {},
    reactionsTable: {},
    momentMarksTable: {},
  };
});

const baseAnalysis: CyaniteAnalysis = {
  genreTags: ["jazz", "blues"],
  moodTags: ["melancholic", "warm"],
  bpm: 92,
  musicalKey: "C minor",
  energyLevel: "medium",
  energyDynamics: "stable",
  valence: 0.4,
  arousal: 0.6,
  caption: "A smoky late-night jazz number.",
  era: "1920s",
  genre: { jazz: 0.7, blues: 0.3 },
  mood: { melancholic: 0.6, warm: 0.4 },
  analyzedAt: "2026-01-01T00:00:00.000Z",
};

let app: Express;

beforeEach(async () => {
  dbState.songRows = [{ id: 1, cyaniteAnalysis: { ...baseAnalysis } }];
  dbState.captured = null;

  const { default: songsRouter } = await import("./songs");
  app = express();
  app.use(express.json());
  app.use("/api", songsRouter);
});

afterEach(() => {
  vi.clearAllMocks();
});

function capturedAnalysis(): CyaniteAnalysis {
  expect(dbState.captured).not.toBeNull();
  const analysis = dbState.captured!["cyaniteAnalysis"] as CyaniteAnalysis;
  expect(analysis).toBeTruthy();
  return analysis;
}

describe("PUT /songs/:id/sound-analysis merge behavior", () => {
  it("preserves untouched scalar fields when only tags are edited", async () => {
    const res = await request(app)
      .put("/api/songs/1/sound-analysis")
      .send({ genreTags: ["jazz", "soul"], moodTags: ["melancholic", "warm"] });

    expect(res.status).toBe(200);
    const analysis = capturedAnalysis();

    expect(analysis.genreTags).toEqual(["jazz", "soul"]);
    expect(analysis.bpm).toBe(92);
    expect(analysis.musicalKey).toBe("C minor");
    expect(analysis.energyLevel).toBe("medium");
    expect(analysis.energyDynamics).toBe("stable");
    expect(analysis.valence).toBe(0.4);
    expect(analysis.arousal).toBe(0.6);
    expect(analysis.caption).toBe("A smoky late-night jazz number.");
    expect(analysis.era).toBe("1920s");
  });

  it("always preserves the AI-derived genre/mood distributions", async () => {
    const res = await request(app)
      .put("/api/songs/1/sound-analysis")
      .send({ genreTags: ["ambient"], moodTags: ["calm"], bpm: 70 });

    expect(res.status).toBe(200);
    const analysis = capturedAnalysis();

    expect(analysis.bpm).toBe(70);
    expect(analysis.genre).toEqual({ jazz: 0.7, blues: 0.3 });
    expect(analysis.mood).toEqual({ melancholic: 0.6, warm: 0.4 });
  });

  it("updates only the scalar fields that are present in the payload", async () => {
    const res = await request(app)
      .put("/api/songs/1/sound-analysis")
      .send({
        genreTags: ["jazz", "blues"],
        moodTags: ["melancholic", "warm"],
        bpm: 120,
        valence: 0.9,
      });

    expect(res.status).toBe(200);
    const analysis = capturedAnalysis();

    expect(analysis.bpm).toBe(120);
    expect(analysis.valence).toBe(0.9);
    expect(analysis.musicalKey).toBe("C minor");
    expect(analysis.arousal).toBe(0.6);
    expect(analysis.era).toBe("1920s");
  });

  it("clears a field when an explicit null is sent", async () => {
    const res = await request(app)
      .put("/api/songs/1/sound-analysis")
      .send({
        genreTags: ["jazz", "blues"],
        moodTags: ["melancholic", "warm"],
        bpm: null,
        musicalKey: null,
        caption: null,
      });

    expect(res.status).toBe(200);
    const analysis = capturedAnalysis();

    expect(analysis.bpm).toBeNull();
    expect(analysis.musicalKey).toBeNull();
    expect(analysis.caption).toBeNull();
    expect(analysis.energyLevel).toBe("medium");
    expect(analysis.valence).toBe(0.4);
  });

  it("returns 404 when the song does not exist", async () => {
    dbState.songRows = [];
    const res = await request(app)
      .put("/api/songs/999/sound-analysis")
      .send({ genreTags: [], moodTags: [] });

    expect(res.status).toBe(404);
    expect(dbState.captured).toBeNull();
  });
});
