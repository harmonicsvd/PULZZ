import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { listenersTable } from "./listeners";
import { songsTable } from "./songs";

export const momentMarksTable = pgTable("moment_marks", {
  id: serial("id").primaryKey(),
  songId: integer("song_id")
    .notNull()
    .references(() => songsTable.id),
  listenerId: integer("listener_id")
    .notNull()
    .references(() => listenersTable.id),
  timestampMs: integer("timestamp_ms").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMomentMarkSchema = createInsertSchema(momentMarksTable).omit({
  id: true,
  createdAt: true,
});
export type InsertMomentMark = z.infer<typeof insertMomentMarkSchema>;
export type MomentMark = typeof momentMarksTable.$inferSelect;
