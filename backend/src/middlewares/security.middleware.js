import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";

import env from "../config/env.js";

const securityMiddleware = (app) => {
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );

  app.use(compression());

  app.use(hpp());

  app.use(cookieParser());

  app.use(express.json({ limit: "10mb" }));

  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
};

export default securityMiddleware;