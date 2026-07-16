import env from "../config/env.js";
import logger from "../config/logger.js";

const errorMiddleware = (error, req, res, next) => {
  logger.error(
    {
      error: error.message,
      stack: env.NODE_ENV === "development" ? error.stack : undefined,
      method: req.method,
      url: req.originalUrl,
    },
    "Unhandled application error",
  );

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
};

export default errorMiddleware;