import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express, { type Express } from "express";
import request from "supertest";
import type { SongAnalysis } from "@workspace/db";

/**
 * Route-level tests for the two artist edit routes that have no other coverage:
 * PUT /songs/:id/lyrics (saving the timed LRC) and PUT /songs/:id/analysis
 * (saving the lyric-based mood/themes). They lock in that the payload is written
 * back, that a missing song yields a 404, and that a blank language is dropped
 * rather than stored as an empty string.
 *
 * The Drizzle `db` is mocked so we can capture the exact `.set()` payload and
 * control whether the targeted song exists (via the `.returning()` rows).
 */

const dbState: {
  songExists: boolean;
  captured: Record<string, unknown> | null;
} = { songExists: true, captured: null };

vi.mock("@workspace/db", () => {
  const db = {
    update: () => ({
      set: (values: Record<string, unknown>) => {
        dbState.captured = values;
        return {
          where: () => ({
            returning: () =>
              Promise.resolve(
                dbState.songExists ? [{ id: 1, ...values }] : []
              ),
          }),
        };
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

let app: Express;

beforeEach(async () => {
  dbState.songExists = true;
  dbState.captured = null;

  const { default: songsRouter } = await import("./songs");
  app = express();
  app.use(express.json());
  app.use("/api", songsRouter);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("PUT /songs/:id/lyrics", () => {
  it("saves the submitted LRC", async () => {
    const lrc = "[00:01.00]Oh Danny boy\n[00:05.50]The pipes are calling";
    const res = await request(app).put("/api/songs/1/lyrics").send({ lrc });

    expect(res.status).toBe(200);
    expect(dbState.captured).not.toBeNull();
    expect(dbState.captured!["lrc"]).toBe(lrc);
    expect(res.body).toEqual({ ok: true, lrc });
  });

  it("returns 404 when the song does not exist", async () => {
    dbState.songExists = false;
    const res = await request(app)
      .put("/api/songs/999/lyrics")
      .send({ lrc: "[00:01.00]nope" });

    expect(res.status).toBe(404);
  });
});

describe("PUT /songs/:id/analysis", () => {
  it("saves mood and themes", async () => {
    const res = await request(app).put("/api/songs/1/analysis").send({
      mood: ["melancholic", "hopeful"],
      themes: ["loss", "homecoming"],
      language: "en",
    });

    expect(res.status).toBe(200);
    expect(dbState.captured).not.toBeNull();
    const analysis = dbState.captured!["analysis"] as SongAnalysis;
    expect(analysis.mood).toEqual(["melancholic", "hopeful"]);
    expect(analysis.themes).toEqual(["loss", "homecoming"]);
    expect(analysis.language).toBe("en");
  });

  it("drops a blank language instead of storing an empty string", async () => {
    const res = await request(app).put("/api/songs/1/analysis").send({
      mood: ["calm"],
      themes: ["nature"],
      language: "   ",
    });

    expect(res.status).toBe(200);
    const analysis = dbState.captured!["analysis"] as SongAnalysis;
    expect(analysis.mood).toEqual(["calm"]);
    expect(analysis.themes).toEqual(["nature"]);
    expect("language" in analysis).toBe(false);
  });

  it("returns 404 when the song does not exist", async () => {
    dbState.songExists = false;
    const res = await request(app)
      .put("/api/songs/999/analysis")
      .send({ mood: [], themes: [] });

    expect(res.status).toBe(404);
  });
});
