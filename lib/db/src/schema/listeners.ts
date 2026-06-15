import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listenersTable = pgTable("listeners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genres: text("genres").array().notNull().default([]),
  discoveryPersonality: text("discovery_personality").notNull().default("balanced"),
  discoveryCount: integer("discovery_count").notNull().default(0),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertListenerSchema = createInsertSchema(listenersTable).omit({
  id: true,
  createdAt: true,
  discoveryCount: true,
  points: true,
});
export type InsertListener = z.infer<typeof insertListenerSchema>;
export type Listener = typeof listenersTable.$inferSelect;
