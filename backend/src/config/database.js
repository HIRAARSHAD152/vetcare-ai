import mongoose from "mongoose";

import env from "./env.js";
import logger from "./logger.js";

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);

    logger.info(
      `MongoDB Connected: ${connection.connection.host}`,
    );
  } catch (error) {
    logger.error(
      {
        error: error.message,
      },
      "MongoDB Connection Failed",
    );

    throw error;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();

    logger.info("MongoDB Disconnected");
  } catch (error) {
    logger.error(
      {
        error: error.message,
      },
      "MongoDB Disconnection Failed",
    );

    throw error;
  }
};

export { connectDatabase, disconnectDatabase };