import { asc, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  ListPlansResponse,
  ListSocialLinksResponse,
  ListPublishedReviewsResponse,
  ListTeamMembersResponse,
} from "@workspace/api-zod";
import {
  db,
  planFeaturesTable,
  plansTable,
  reviewsTable,
  serviceCategoriesTable,
  socialLinksTable,
  teamMembersTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/social-links", async (req, res): Promise<void> => {
  const links = await db
    .select()
    .from(socialLinksTable)
    .where(eq(socialLinksTable.isActive, true))
    .orderBy(asc(socialLinksTable.category), asc(socialLinksTable.sortOrder));

  const grouped = new Map<string, { category: string; links: Array<{
    label: string;
    icon: string;
    url: string;
  }> }>();

  for (const link of links) {
    const group = grouped.get(link.category) ?? {
      category: link.category,
      links: [],
    };
    group.links.push({
      label: link.label,
      icon: link.icon,
      url: link.url,
    });
    grouped.set(link.category, group);
  }

  res.json(ListSocialLinksResponse.parse([...grouped.values()]));
});

router.get("/plans", async (req, res): Promise<void> => {
  const [categories, plans, features] = await Promise.all([
    db.select().from(serviceCategoriesTable).orderBy(asc(serviceCategoriesTable.slug)),
    db.select().from(plansTable).orderBy(asc(plansTable.sortOrder)),
    db.select().from(planFeaturesTable).orderBy(asc(planFeaturesTable.sortOrder)),
  ]);

  const response = categories.map((category) => ({
    category: {
      slug: category.slug,
      nameEs: category.nameEs,
      nameEn: category.nameEn,
    },
    plans: plans
      .filter((plan) => plan.serviceCategoryId === category.id)
      .map((plan) => ({
        slug: plan.slug,
        nameEs: plan.nameEs,
        nameEn: plan.nameEn,
        price: plan.price,
        currency: plan.currency,
        periodEs: plan.periodEs,
        periodEn: plan.periodEn,
        badgeEs: plan.badgeEs,
        badgeEn: plan.badgeEn,
        isCustom: plan.isCustom,
        features: features
          .filter((feature) => feature.planId === plan.id)
          .map((feature) => ({
            textEs: feature.textEs,
            textEn: feature.textEn,
          })),
      })),
  }));

  res.json(ListPlansResponse.parse(response));
});

router.get("/reviews", async (req, res): Promise<void> => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.status, "published"))
    .orderBy(desc(reviewsTable.createdAt));

  res.json(
    ListPublishedReviewsResponse.parse(
      reviews.map((review) => ({
        name: review.name,
        company: review.company,
        text: review.text,
        rating: review.rating,
      })),
    ),
  );
});

router.get("/team", async (_req, res): Promise<void> => {
  const members = await db
    .select({
      id: teamMembersTable.id,
      name: teamMembersTable.name,
      roleEs: teamMembersTable.roleEs,
      roleEn: teamMembersTable.roleEn,
      bioEs: teamMembersTable.bioEs,
      bioEn: teamMembersTable.bioEn,
      imageRef: teamMembersTable.imageRef,
      sortOrder: teamMembersTable.sortOrder,
      isActive: teamMembersTable.isActive,
    })
    .from(teamMembersTable)
    .where(eq(teamMembersTable.isActive, true))
    .orderBy(asc(teamMembersTable.sortOrder), asc(teamMembersTable.id));

  res.json(ListTeamMembersResponse.parse(members));
});

export default router;