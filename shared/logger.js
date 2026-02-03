/**
 * Centralized logger for backend API and worker.
 * Uses LOG_LEVEL and NODE_ENV for environment-based configuration.
 */
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const level = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

const logger = pino({
  level,
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});

export { logger };
