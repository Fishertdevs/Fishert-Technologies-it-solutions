import { asc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  planFeatures,
  serviceCategories,
  servicePlans,
  siteSettings,
  socialLinks,
} from "@workspace/db/schema";

const router: IRouter = Router();

const getSetting = (settings: Map<string, string>, key: string) =>
  settings.get(key) ?? "";

router.get("/content", async (req, res) => {
  try {
    const [settingRows, socialRows, categoryRows, planRows, featureRows] =
      await Promise.all([
        db.select().from(siteSettings),
        db
          .select()
          .from(socialLinks)
          .where(eq(socialLinks.isActive, true))
          .orderBy(asc(socialLinks.sortOrder), asc(socialLinks.id)),
        db
          .select()
          .from(serviceCategories)
          .orderBy(asc(serviceCategories.id)),
        db
          .select()
          .from(servicePlans)
          .orderBy(asc(servicePlans.sortOrder), asc(servicePlans.id)),
        db
          .select()
          .from(planFeatures)
          .orderBy(asc(planFeatures.sortOrder), asc(planFeatures.id)),
      ]);

    const settings = new Map(settingRows.map((setting) => [setting.settingKey, setting.value]));
    const featuresByPlan = new Map<number, typeof featureRows>();

    for (const feature of featureRows) {
      const features = featuresByPlan.get(feature.planId) ?? [];
      features.push(feature);
      featuresByPlan.set(feature.planId, features);
    }

    const plansByCategory = new Map<number, typeof planRows>();
    for (const plan of planRows) {
      const plans = plansByCategory.get(plan.categoryId) ?? [];
      plans.push(plan);
      plansByCategory.set(plan.categoryId, plans);
    }

    res.json({
      contact: {
        email: getSetting(settings, "contact_email"),
        phone: getSetting(settings, "phone_display"),
        whatsappNumber: getSetting(settings, "whatsapp_number"),
        location:
          getSetting(settings, "location_es") || getSetting(settings, "location_en"),
        businessHoursWeekdays: getSetting(settings, "business_hours_weekdays_es"),
        businessHoursWeekend: getSetting(settings, "business_hours_weekend_es"),
      },
      socialLinks: socialRows.map((social) => ({
        platform: social.platform,
        label: social.label,
        url: social.url,
      })),
      services: categoryRows.map((category) => ({
        slug: category.slug,
        nameEs: category.nameEs,
        nameEn: category.nameEn,
        plans: (plansByCategory.get(category.id) ?? []).map((plan) => ({
          slug: plan.slug,
            name: plan.nameEs,
            priceCop: Number(plan.price.replace(/[^\d]/g, "")) || null,
            priceLabelEs: plan.price,
            priceLabelEn: plan.price,
            currency: plan.currency,
            periodEs: plan.periodEs,
            periodEn: plan.periodEn,
            badgeEs: plan.badgeEs,
            badgeEn: plan.badgeEn,
            isCustom: plan.isCustom,
            features: (featuresByPlan.get(plan.id) ?? []).map((feature) => ({
              es: feature.featureEs,
              en: feature.featureEn,
            })),
          })),
      })),
    });
  } catch (error) {
    req.log.error({ err: error }, "Could not load public site content");
    res.status(500).json({ message: "No fue posible cargar el contenido del sitio." });
  }
});

export default router;