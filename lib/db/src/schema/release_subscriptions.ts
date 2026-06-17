import { integer, pgTable, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { listenersTable } from "./listeners";
import { songsTable } from "./songs";

/**
 * A listener's opt-in to be pinged when a song they discovered goes live.
 * One row per (listener, song); `notifiedAt` records when the release-day
 * notification was delivered/acknowledged so it is only ever shown once.
 */
export const releaseSubscriptionsTable = pgTable(
  "release_subscriptions",
  {
    id: serial("id").primaryKey(),
    listenerId: integer("listener_id")
      .notNull()
      .references(() => listenersTable.id),
    songId: integer("song_id")
      .notNull()
      .references(() => songsTable.id),
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.listenerId, t.songId)]
);

export const insertReleaseSubscriptionSchema = createInsertSchema(
  releaseSubscriptionsTable
).omit({
  id: true,
  notifiedAt: true,
  createdAt: true,
});
export type InsertReleaseSubscription = z.infer<
  typeof insertReleaseSubscriptionSchema
>;
export type ReleaseSubscription = typeof releaseSubscriptionsTable.$inferSelect;
