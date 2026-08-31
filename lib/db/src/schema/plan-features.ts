import { createInsertSchema } from "drizzle-zod";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { plansTable } from "./plans";

export const planFeaturesTable = pgTable("plan_features", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plansTable.id, { onDelete: "cascade" }),
  textEs: text("text_es").notNull(),
  textEn: text("text_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertPlanFeatureSchema = createInsertSchema(
  planFeaturesTable,
).omit({ id: true, createdAt: true });

export type InsertPlanFeature = z.infer<typeof insertPlanFeatureSchema>;
export type PlanFeature = typeof planFeaturesTable.$inferSelect;