import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { z } from "zod";

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  category: text("category").notNull(),
  label: text("label").notNull(),
  icon: text("icon").notNull(),
  url: text("url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("social_links_active_order_idx").on(table.isActive, table.sortOrder),
]);

export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("service_categories_slug_idx").on(table.slug),
]);

export const servicePlans = pgTable("plans", {
  id: serial("id").primaryKey(),
  categoryId: integer("service_category_id")
    .notNull()
    .references(() => serviceCategories.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  price: text("price").notNull(),
  currency: text("currency").default("COP").notNull(),
  periodEs: text("period_es"),
  periodEn: text("period_en"),
  badgeEs: text("badge_es"),
  badgeEn: text("badge_en"),
  isCustom: boolean("is_custom").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique("plans_category_slug_unique").on(table.categoryId, table.slug),
  index("plans_category_order_idx").on(table.categoryId, table.sortOrder),
]);

export const planFeatures = pgTable("plan_features", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => servicePlans.id, { onDelete: "cascade" }),
  featureEs: text("text_es").notNull(),
  featureEn: text("text_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: createdAt(),
}, (table) => [
  index("plan_features_plan_order_idx").on(table.planId, table.sortOrder),
]);

export const contactMessages = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: createdAt(),
}, (table) => [
  index("contact_messages_created_at_idx").on(table.createdAt),
]);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: text("name").notNull(),
  company: text("company"),
  quote: text("text").notNull(),
  stars: integer("rating").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("reviews_published_idx").on(table.status, table.createdAt),
]);

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});
export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({ id: true });
export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({ id: true });
export const insertServicePlanSchema = createInsertSchema(servicePlans).omit({ id: true });
export const insertPlanFeatureSchema = createInsertSchema(planFeatures).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});
export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const reviewLanguageSchema = z.enum(["es", "en"]);
export const reviewStatusSchema = z.enum(["pending", "published", "rejected"]);

export type SiteSetting = typeof siteSettings.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type ServicePlan = typeof servicePlans.$inferSelect;
export type PlanFeature = typeof planFeatures.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Review = typeof reviews.$inferSelect;