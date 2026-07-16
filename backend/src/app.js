import express from "express";

import securityMiddleware from "./middlewares/security.middleware.js";
import globalRateLimiter from "./middlewares/rateLimit.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

securityMiddleware(app);

app.use(globalRateLimiter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VetCare AI API is running.",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;