import express from "express";

import securityMiddleware from "./middlewares/security.middleware.js";
import globalRateLimiter from "./middlewares/rateLimit.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import ApiError from "./utils/ApiError.js";
import asyncHandler from "./utils/asyncHandler.js";


// Routes
import authRoutes from "./modules/auth/auth.routes.js";

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

app.get(
  "/api/v1/test-error",
  asyncHandler(async () => {
    throw new ApiError(400, "Custom error system is working.");
  }),
);

app.use("/api/v1/auth", authRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;