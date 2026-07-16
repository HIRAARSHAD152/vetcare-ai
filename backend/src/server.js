import http from "http";
import mongoose from "mongoose";

import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.fatal(
      {
        error: error.message,
      },
      "Server startup failed",
    );

    process.exit(1);
  }
};

const shutdownServer = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await disconnectDatabase();

    logger.info("Server shutdown completed");

    process.exit(0);
  });
};

process.on("SIGINT", () => shutdownServer("SIGINT"));
process.on("SIGTERM", () => shutdownServer("SIGTERM"));

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

startServer();