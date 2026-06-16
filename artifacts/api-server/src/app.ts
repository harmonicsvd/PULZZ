import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve generated demo media (audio + cover art) committed under public/media.
// Resolved relative to the bundle dir (__dirname) so it works in dev and prod.
app.use(
  "/api/media",
  express.static(path.resolve(__dirname, "../public/media"), {
    maxAge: "1h",
  }),
);

app.use("/api", router);

export default app;
