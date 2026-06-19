import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express, { type Express } from "express";
import request from "supertest";
import type { SongAnalysis } from "@workspace/db";

/**
 * Route-level tests for the inline lyric analysis that POST /songs runs at
 * submission time. They lock in that analyzeLyrics() is invoked with the
 * submitted lyrics and that the derived mood/themes/language are stored on the
 * inserted song; that a failing analysis is swallowed so submission still
 * succeeds with a null analysis; and that submitting without lyrics skips
 * analysis entirely.
 *
 * The Drizzle `db` is mocked so we can capture the exact `.values()` payload
 * written on insert and return an artist name on select. analyzeLyrics is
 * mocked so we control its result (or make it throw) and assert how it's called.
 */

const dbState: {
  inserted: Record<string, unknown> | null;
} = { inserted: null };

vi.mock("@workspace/db", () => {
  const db = {
    insert: () => ({
      values: (values: Record<string, unknown>) => {
        dbState.inserted = values;
        return {
          returning: () =>
            Promise.resolve([
              {
                id: 1,
                status: "active",
                coverColor: "#7B61FF",
                tags: [],
                ...values,
              },
            ]),
        };
      },
    }),
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([{ name: "Luna Voss" }]),
      }),
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

const analyzeLyrics = vi.fn();

vi.mock("../lib/musixmatch", () => ({
  analyzeLyrics: (...args: unknown[]) => analyzeLyrics(...args),
}));

let app: Express;

function submitBody(overrides: Record<string, unknown> = {}) {
  return {
    title: "Danny Boy",
    artistId: 1,
    genre: "Folk",
    releaseDate: "2026-06-21",
    isrc: "USABC2600001",
    story: "A timeless lament.",
    ...overrides,
  };
}

beforeEach(async () => {
  dbState.inserted = null;
  analyzeLyrics.mockReset();

  const { default: songsRouter } = await import("./songs");
  app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as unknown as { log: Record<string, () => void> }).log = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    };
    next();
  });
  app.use("/api", songsRouter);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /songs lyric analysis", () => {
  it("runs analyzeLyrics and stores the derived mood/themes when lyrics are provided", async () => {
    const lyrics = "Oh Danny boy\nThe pipes are calling";
    analyzeLyrics.mockResolvedValue({
      mood: ["melancholic", "hopeful"],
      themes: ["loss", "homecoming"],
      language: "en",
    });

    const res = await request(app)
      .post("/api/songs")
      .send(submitBody({ lyrics }));

    expect(res.status).toBe(201);
    expect(analyzeLyrics).toHaveBeenCalledTimes(1);
    const [, passedLyrics] = analyzeLyrics.mock.calls[0]!;
    expect(passedLyrics).toBe(lyrics);

    expect(dbState.inserted).not.toBeNull();
    const analysis = dbState.inserted!["analysis"] as SongAnalysis;
    expect(analysis.mood).toEqual(["melancholic", "hopeful"]);
    expect(analysis.themes).toEqual(["loss", "homecoming"]);
    expect(analysis.language).toBe("en");
  });

  it("still succeeds and stores a null analysis when analyzeLyrics throws", async () => {
    analyzeLyrics.mockRejectedValue(new Error("musixmatch down"));

    const res = await request(app)
      .post("/api/songs")
      .send(submitBody({ lyrics: "Some lyrics here" }));

    expect(res.status).toBe(201);
    expect(analyzeLyrics).toHaveBeenCalledTimes(1);
    expect(dbState.inserted).not.toBeNull();
    expect(dbState.inserted!["analysis"]).toBeNull();
  });

  it("skips analysis when no lyrics are provided", async () => {
    const res = await request(app).post("/api/songs").send(submitBody());

    expect(res.status).toBe(201);
    expect(analyzeLyrics).not.toHaveBeenCalled();
    expect(dbState.inserted).not.toBeNull();
    expect(dbState.inserted!["analysis"]).toBeNull();
  });

  it("skips analysis when lyrics are only whitespace", async () => {
    const res = await request(app)
      .post("/api/songs")
      .send(submitBody({ lyrics: "   \n  " }));

    expect(res.status).toBe(201);
    expect(analyzeLyrics).not.toHaveBeenCalled();
    expect(dbState.inserted!["analysis"]).toBeNull();
  });
});
