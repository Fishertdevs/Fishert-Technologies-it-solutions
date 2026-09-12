import multer from "multer";
import { Router, type IRouter, type RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { CreateContactBody, CreateReviewBody } from "@workspace/api-zod";
import { contactsTable, db, reviewsTable } from "@workspace/db";
import { notifyPendingReview } from "../lib/telegram";

const router: IRouter = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxVideoBytes = 20 * 1024 * 1024;
const acceptedVideoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const uploadReviewVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxVideoBytes, files: 1 },
}).single("video");

const parseReviewUpload: RequestHandler = (req, res, next) => {
  uploadReviewVideo(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "El video no puede superar los 20 MB." });
      return;
    }
    if (error) {
      res.status(400).json({ error: "No pudimos procesar el video enviado." });
      return;
    }
    next();
  });
};

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

router.post("/reviews", parseReviewUpload, async (req, res): Promise<void> => {
  const video = req.file;
  if (video && !acceptedVideoTypes.has(video.mimetype)) {
    res.status(400).json({ error: "El video debe estar en formato MP4, WebM o MOV." });
    return;
  }

  const videoConsent =
    typeof req.body.videoConsent === "boolean"
      ? req.body.videoConsent
      : req.body.videoConsent === "true";
  const parsed = CreateReviewBody.safeParse({
    ...req.body,
    rating: Number(req.body.rating),
    ...(req.body.videoConsent !== undefined ? { videoConsent } : {}),
  });
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid review submission");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!Number.isInteger(parsed.data.rating)) {
    res.status(400).json({ error: "Rating must be a whole number from 1 to 5." });
    return;
  }
  if (video && parsed.data.videoConsent !== true) {
    res.status(400).json({ error: "Debes autorizar el tratamiento de datos para subir un video." });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      name: parsed.data.name.trim(),
      company: parsed.data.company?.trim() || null,
      text: parsed.data.text.trim(),
      rating: parsed.data.rating,
      category: video ? "testimonial" : "review",
      videoConsentAt: video ? new Date() : null,
      status: "pending",
    })
    .returning({
      id: reviewsTable.id,
      status: reviewsTable.status,
      createdAt: reviewsTable.createdAt,
    });

  try {
    const notification = await notifyPendingReview({
      id: review.id,
      name: parsed.data.name.trim(),
      company: parsed.data.company?.trim() || null,
      text: parsed.data.text.trim(),
      rating: parsed.data.rating,
      category: video ? "testimonial" : "review",
      ...(video
        ? {
            video: {
              buffer: video.buffer,
              mimeType: video.mimetype,
              fileName: video.originalname || "testimonio.mp4",
            },
          }
        : {}),
    });
    if (video && (!notification.notified || !notification.telegramFileId)) {
      await db.delete(reviewsTable).where(eq(reviewsTable.id, review.id));
      res.status(503).json({ error: "El almacenamiento seguro del video no está disponible." });
      return;
    }
    if (notification.telegramFileId) {
      await db
        .update(reviewsTable)
        .set({ telegramFileId: notification.telegramFileId, updatedAt: new Date() })
        .where(eq(reviewsTable.id, review.id));
    }
  } catch (error) {
    if (video) {
      await db.delete(reviewsTable).where(eq(reviewsTable.id, review.id));
      req.log.warn({ err: error, reviewId: review.id }, "Review video upload failed");
      res.status(502).json({ error: "No pudimos guardar el video en este momento." });
      return;
    }
    req.log.warn({ err: error, reviewId: review.id }, "Review saved but Telegram notification failed");
  }

  res.status(201).json({
    id: review.id,
    status: "pending",
    createdAt: review.createdAt,
  });
});

export default router;