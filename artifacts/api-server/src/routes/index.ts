import { Router, type IRouter } from "express";
import healthRouter from "./health";
import songsRouter from "./songs";
import reactionsRouter from "./reactions";
import momentsRouter from "./moments";
import wallRouter from "./wall";
import artistsRouter from "./artists";
import listenersRouter from "./listeners";
import musixmatchRouter from "./musixmatch";
import cyaniteRouter from "./cyanite";
import storageRouter from "./storage";
import demoRouter from "./demo";

const router: IRouter = Router();

router.use(healthRouter);
router.use(songsRouter);
router.use(reactionsRouter);
router.use(momentsRouter);
router.use(wallRouter);
router.use(artistsRouter);
router.use(listenersRouter);
router.use(musixmatchRouter);
router.use(cyaniteRouter);
router.use(storageRouter);
router.use(demoRouter);

export default router;
