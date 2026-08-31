import { Router, type IRouter } from "express";
import { CreateContactMessageBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { contactMessages } from "@workspace/db/schema";

const router: IRouter = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/contact", async (req, res) => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success || !emailPattern.test(parsed.data?.email ?? "")) {
    res.status(400).json({ message: "Revisa los datos de contacto e inténtalo de nuevo." });
    return;
  }

  try {
    const payload = parsed.data;
    const [created] = await db
      .insert(contactMessages)
      .values({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim() || null,
        company: payload.company?.trim() || null,
        message: payload.message.trim(),
      })
      .returning({ id: contactMessages.id });

    res.status(201).json({
      success: true,
      id: created.id,
      message:
        payload.language === "es"
          ? "Tu mensaje fue enviado correctamente."
          : "Your message was sent successfully.",
    });
  } catch (error) {
    req.log.error({ err: error }, "Could not save contact message");
    res.status(500).json({ message: "No fue posible guardar el mensaje." });
  }
});

export default router;