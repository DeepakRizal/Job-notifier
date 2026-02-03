import { logger } from "../../shared/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went Wrong!";

  logger.error({ err, statusCode, message }, err.message);
  logger.debug({ stack: err.stack }, "Error stack");

  const isProd = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
