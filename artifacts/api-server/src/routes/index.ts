import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import bookingsRouter from "./bookings";
import instagramRouter from "./instagram";
import adminRouter from "./admin";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(tripsRouter);
router.use(bookingsRouter);
router.use(instagramRouter);
router.use(adminRouter);
router.use(statsRouter);

export default router;
