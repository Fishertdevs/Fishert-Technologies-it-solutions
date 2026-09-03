import { Router, type IRouter } from "express";
import { CreateContactBody, CreateReviewBody } from "@workspace/api-zod";
import { contactsTable, db, reviewsTable } from "@workspace/db";
import { notifyPendingReview } from "../lib/telegram";

const router: IRouter = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/contacts", async (req, res): Promise<void> => {
  const parsed = CreateContactBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid contact submission");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!emailPattern.test(parsed.data.email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }

  const [contact] = await db
    .insert(contactsTable)
    .values({
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      company: parsed.data.company?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
      message: parsed.data.message.trim(),
    })
    .returning({
      id: contactsTable.id,
      createdAt: contactsTable.createdAt,
    });

  res.status(201).json({ id: contact.id, createdAt: contact.createdAt });
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid review submission");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!Number.isInteger(parsed.data.rating)) {
    res.status(400).json({ error: "Rating must be a whole number from 1 to 5." });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      name: parsed.data.name.trim(),
      company: parsed.data.company?.trim() || null,
      text: parsed.data.text.trim(),
      rating: parsed.data.rating,
      status: "pending",
    })
    .returning({
      id: reviewsTable.id,
      status: reviewsTable.status,
      createdAt: reviewsTable.createdAt,
    });

  try {
    await notifyPendingReview({
      id: review.id,
      name: parsed.data.name.trim(),
      company: parsed.data.company?.trim() || null,
      text: parsed.data.text.trim(),
      rating: parsed.data.rating,
    });
  } catch (error) {
    req.log.warn({ err: error, reviewId: review.id }, "Review saved but Telegram notification failed");
  }

  res.status(201).json({
    id: review.id,
    status: "pending",
    createdAt: review.createdAt,
  });
});

export default router;