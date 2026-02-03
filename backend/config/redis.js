import Redis from "ioredis";
import dotenv from "dotenv";
import { logger } from "../../shared/logger.js";

dotenv.config({ path: "../.env" });

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  logger.info("Redis connected");
});
redis.on("error", (err) => {
  logger.error({ err }, "Redis error");
});

export default redis;
