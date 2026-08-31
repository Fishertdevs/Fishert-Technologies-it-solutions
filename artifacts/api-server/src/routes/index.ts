import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contentRouter from "./content";
import submissionsRouter from "./submissions";
import contactSettingsRouter from "./contact-settings";
import telegramRouter from "./telegram";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contentRouter);
router.use(contactSettingsRouter);
router.use(submissionsRouter);
router.use(telegramRouter);

export default router;
