import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const reviewsTable = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    company: text("company"),
    text: text("text").notNull(),
    rating: integer("rating").notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("reviews_rating_range", sql`rating >= 1 AND rating <= 5`),
    check(
      "reviews_status_values",
      sql`status IN ('pending', 'published', 'rejected')`,
    ),
  ],
);

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;