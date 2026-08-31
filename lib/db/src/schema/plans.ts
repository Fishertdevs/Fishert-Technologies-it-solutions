import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { serviceCategoriesTable } from "./service-categories";

export const plansTable = pgTable(
  "plans",
  {
    id: serial("id").primaryKey(),
    serviceCategoryId: integer("service_category_id")
      .notNull()
      .references(() => serviceCategoriesTable.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    nameEs: text("name_es").notNull(),
    nameEn: text("name_en").notNull(),
    price: text("price").notNull(),
    currency: text("currency").notNull().default("COP"),
    periodEs: text("period_es"),
    periodEn: text("period_en"),
    badgeEs: text("badge_es"),
    badgeEn: text("badge_en"),
    isCustom: boolean("is_custom").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("plans_category_slug_unique").on(
      table.serviceCategoryId,
      table.slug,
    ),
  ],
);

export const insertPlanSchema = createInsertSchema(plansTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plansTable.$inferSelect;