import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const serviceCategoriesTable = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertServiceCategorySchema = createInsertSchema(
  serviceCategoriesTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertServiceCategory = z.infer<
  typeof insertServiceCategorySchema
>;
export type ServiceCategory = typeof serviceCategoriesTable.$inferSelect;