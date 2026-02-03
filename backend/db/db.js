import mongoose from "mongoose";
import { logger } from "../../shared/logger.js";

export default async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("DB connected");
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to mongodb");
    process.exit(1);
  }
}
