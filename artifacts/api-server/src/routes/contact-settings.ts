import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { GetContactSettingsResponse } from "@workspace/api-zod";
import { contactSettingsTable, db } from "@workspace/db";

const router: IRouter = Router();

router.get("/contact-settings", async (req, res): Promise<void> => {
  try {
    const [settings] = await db
      .select()
      .from(contactSettingsTable)
      .where(eq(contactSettingsTable.slug, "main"))
      .limit(1);

    if (!settings) {
      res.status(404).json({ error: "Contact settings are not configured." });
      return;
    }

    res.json(
      GetContactSettingsResponse.parse({
        email: settings.email,
        phone: settings.phone,
        whatsappNumber: settings.whatsappNumber,
        locationEs: settings.locationEs,
        locationEn: settings.locationEn,
        businessHoursWeekdaysEs: settings.businessHoursWeekdaysEs,
        businessHoursWeekdaysEn: settings.businessHoursWeekdaysEn,
        businessHoursWeekendEs: settings.businessHoursWeekendEs,
        businessHoursWeekendEn: settings.businessHoursWeekendEn,
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Could not load contact settings");
    res.status(500).json({ error: "Could not load contact settings." });
  }
});

export default router;