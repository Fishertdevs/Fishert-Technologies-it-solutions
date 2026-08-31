import { createInsertSchema } from "drizzle-zod";
import {
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const telegramSessionsTable = pgTable(
  "telegram_sessions",
  {
    id: serial("id").primaryKey(),
    chatId: text("chat_id").notNull(),
    state: text("state").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("telegram_sessions_chat_id_unique").on(table.chatId)],
);

export const insertTelegramSessionSchema = createInsertSchema(
  telegramSessionsTable,
).omit({ id: true, updatedAt: true });

export type InsertTelegramSession = z.infer<typeof insertTelegramSessionSchema>;
export type TelegramSession = typeof telegramSessionsTable.$inferSelect;