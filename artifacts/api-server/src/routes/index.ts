import { Router, type IRouter } from "express";
import contentRouter from "./content";
import contactRouter from "./contact";
import healthRouter from "./health";
import reviewsRouter from "./reviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contentRouter);
router.use(contactRouter);
router.use(reviewsRouter);

export default router;
