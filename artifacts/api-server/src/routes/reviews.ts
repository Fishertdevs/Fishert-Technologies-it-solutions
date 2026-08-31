import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { GetReviewsQueryParams, CreateReviewBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { reviews } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/reviews", async (req, res) => {
  const query = GetReviewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ message: "El idioma solicitado no es válido." });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.status, "published"))
      .orderBy(desc(reviews.createdAt))
      .limit(100);

    const totalStars = rows.reduce((sum, review) => sum + review.stars, 0);
    const average = rows.length === 0 ? 0 : Number((totalStars / rows.length).toFixed(1));

    res.json({
      reviews: rows.map((review) => ({
        id: review.id,
        authorName: review.authorName,
        company: review.company,
        quote: review.quote,
        stars: review.stars,
        language: query.data.language ?? "es",
        createdAt: review.createdAt.toISOString(),
      })),
      average,
      total: rows.length,
    });
  } catch (error) {
    req.log.error({ err: error }, "Could not load published reviews");
    res.status(500).json({ message: "No fue posible cargar las reseñas." });
  }
});

router.post("/reviews", async (req, res) => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success || !Number.isInteger(parsed.data?.stars)) {
    res.status(400).json({ message: "Revisa los datos de la reseña e inténtalo de nuevo." });
    return;
  }

  try {
    const payload = parsed.data;
    const [created] = await db
      .insert(reviews)
      .values({
        authorName: payload.authorName.trim(),
        company: payload.company?.trim() || null,
        quote: payload.quote.trim(),
        stars: payload.stars,
        status: "pending",
      })
      .returning({ id: reviews.id });

    res.status(201).json({
      success: true,
      id: created.id,
      message:
        payload.language === "es"
          ? "Tu reseña fue recibida y quedará pendiente de moderación."
          : "Your review was received and is pending moderation.",
    });
  } catch (error) {
    req.log.error({ err: error }, "Could not save review");
    res.status(500).json({ message: "No fue posible guardar la reseña." });
  }
});

export default router;