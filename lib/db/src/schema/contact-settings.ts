import { createInsertSchema } from "drizzle-zod";
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const contactSettingsTable = pgTable(
  "contact_settings",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().default("main"),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    whatsappNumber: text("whatsapp_number").notNull(),
    locationEs: text("location_es").notNull(),
    locationEn: text("location_en").notNull(),
    businessHoursWeekdaysEs: text("business_hours_weekdays_es").notNull(),
    businessHoursWeekdaysEn: text("business_hours_weekdays_en").notNull(),
    businessHoursWeekendEs: text("business_hours_weekend_es").notNull(),
    businessHoursWeekendEn: text("business_hours_weekend_en").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("contact_settings_slug_unique").on(table.slug)],
);

export const insertContactSettingsSchema = createInsertSchema(
  contactSettingsTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertContactSettings = z.infer<typeof insertContactSettingsSchema>;
export type ContactSettings = typeof contactSettingsTable.$inferSelect;