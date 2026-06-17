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

export default router;
