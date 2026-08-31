import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contentRouter from "./content";
import submissionsRouter from "./submissions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contentRouter);
router.use(submissionsRouter);

export default router;
