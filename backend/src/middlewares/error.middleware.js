import env from "../config/env.js";
import logger from "../config/logger.js";

const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  logger.error(
    {
      error: error.message,
      statusCode,
      stack: env.NODE_ENV === "development" ? error.stack : undefined,
      method: req.method,
      url: req.originalUrl,
    },
    "Unhandled application error",
  );

  res.status(statusCode).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? statusCode === 500
          ? "Internal server error"
          : error.message
        : error.message,

    ...(error.details && {
      details: error.details,
    }),
  });
};

export default errorMiddleware;