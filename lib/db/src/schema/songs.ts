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
  producer?: string;
}

export interface SongAnalysis {
  mood?: string[];
  themes?: string[];
  language?: string;
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
  isrc: text("isrc"),
  audioUrl: text("audio_url").notNull(),
  artworkUrl: text("artwork_url"),
  story: text("story").notNull().default(""),
  lyrics: text("lyrics"),
  lrc: text("lrc"),
  credits: jsonb("credits").$type<SongCredits>(),
  analysis: jsonb("analysis").$type<SongAnalysis>(),
  instruments: text("instruments").array().default([]),
  durationSeconds: integer("duration_seconds"),
  coverColor: text("cover_color").notNull().default("#7B61FF"),
  tags: text("tags").array().default([]),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSongSchema = createInsertSchema(songsTable).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songsTable.$inferSelect;
