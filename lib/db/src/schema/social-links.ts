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

export const socialLinksTable = pgTable(
  "social_links",
  {
    id: serial("id").primaryKey(),
    category: text("category").notNull(),
    label: text("label").notNull(),
    icon: text("icon").notNull(),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("social_links_category_url_unique").on(
      table.category,
      table.url,
    ),
  ],
);

export const insertSocialLinkSchema = createInsertSchema(
  socialLinksTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinksTable.$inferSelect;