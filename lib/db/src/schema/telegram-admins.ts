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

export const telegramAdminsTable = pgTable(
  "telegram_admins",
  {
    id: serial("id").primaryKey(),
    chatId: text("chat_id").notNull(),
    username: text("username"),
    firstName: text("first_name"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("telegram_admins_chat_id_unique").on(table.chatId)],
);

export const insertTelegramAdminSchema = createInsertSchema(
  telegramAdminsTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertTelegramAdmin = z.infer<typeof insertTelegramAdminSchema>;
export type TelegramAdmin = typeof telegramAdminsTable.$inferSelect;