import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * The set of creative roles/skills an artist can offer or look for in a
 * collaborator. Used by the collaboration hub to suggest complementary matches.
 */
export const ARTIST_ROLES = [
  "singer",
  "lyricist",
  "composer",
  "producer",
  "instrumentalist",
  "mixEngineer",
  "masteringEngineer",
] as const;
export type ArtistRole = (typeof ARTIST_ROLES)[number];

export interface ArtistLinks {
  website?: string;
  spotify?: string;
  appleMusic?: string;
  instagram?: string;
  soundcloud?: string;
  youtube?: string;
  tiktok?: string;
}

export const artistsTable = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  genre: text("genre"),
  distributor: text("distributor"),
  roles: text("roles").array().default([]),
  links: jsonb("links").$type<ArtistLinks>(),
  // Song the artist has chosen to spotlight in the dashboard's featured Sound
  // DNA slot. Plain integer (no FK) to avoid a circular schema import; stale
  // ids fall back to the most recent song at the read site.
  featuredSongId: integer("featured_song_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertArtistSchema = createInsertSchema(artistsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artistsTable.$inferSelect;
