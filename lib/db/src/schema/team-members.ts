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

export const teamMembersTable = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    roleEs: text("role_es").notNull(),
    roleEn: text("role_en").notNull(),
    bioEs: text("bio_es").notNull(),
    bioEn: text("bio_en").notNull(),
    imageRef: text("image_ref"),
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
  (table) => [uniqueIndex("team_members_name_unique").on(table.name)],
);

export const insertTeamMemberSchema = createInsertSchema(teamMembersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembersTable.$inferSelect;