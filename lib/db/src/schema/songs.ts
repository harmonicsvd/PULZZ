import {
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { artistsTable } from "./artists";

export interface SongCredits {
  lyricist?: string;
  composer?: string;
  vocalist?: string;
  mixEngineer?: string;
  masteringEngineer?: string;
  producer?: string;
}

export interface SongAnalysis {
  mood?: string[];
  themes?: string[];
  language?: string;
}

/**
 * Normalized, sound-based analysis from Cyanite (distinct from the lyrics-based
 * `SongAnalysis` above). Stored once an analysis reaches the Finished state.
 * Distributions (`genre`/`mood`) are kept for sound-similarity scoring; the
 * scalar fields drive the artist-facing "Sound DNA" display.
 */
export interface CyaniteAnalysis {
  genreTags: string[];
  moodTags: string[];
  bpm: number | null;
  musicalKey: string | null;
  energyLevel: string | null;
  energyDynamics: string | null;
  valence: number | null;
  arousal: number | null;
  caption: string | null;
  era: string | null;
  genre: Record<string, number>;
  mood: Record<string, number>;
  analyzedAt: string;
}

export interface SongLicense {
  type: string;
  detail?: string;
  source?: string;
}

export const songsTable = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artistsTable.id),
  genre: text("genre").notNull(),
  language: text("language").default("en"),
  releaseDate: date("release_date", { mode: "string" }).notNull(),
  releaseTime: text("release_time"),
  distributor: text("distributor"),
  isrc: text("isrc"),
  streamingId: text("streaming_id"),
  audioUrl: text("audio_url").notNull(),
  artworkUrl: text("artwork_url"),
  story: text("story").notNull().default(""),
  lyrics: text("lyrics"),
  lrc: text("lrc"),
  credits: jsonb("credits").$type<SongCredits>(),
  analysis: jsonb("analysis").$type<SongAnalysis>(),
  cyaniteTrackId: text("cyanite_track_id"),
  cyaniteStatus: text("cyanite_status"),
  cyaniteAnalysis: jsonb("cyanite_analysis").$type<CyaniteAnalysis>(),
  license: jsonb("license").$type<SongLicense>(),
  instruments: text("instruments").array().default([]),
  durationSeconds: integer("duration_seconds"),
  coverColor: text("cover_color").notNull().default("#7B61FF"),
  tags: text("tags").array().default([]),
  status: text("status").notNull().default("active"),
  releasedAt: timestamp("released_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSongSchema = createInsertSchema(songsTable).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songsTable.$inferSelect;
