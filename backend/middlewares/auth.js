import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logger } from "../../shared/logger.js";

export default async function authMiddleware(req, res, next) {
  logger.debug({ hasAuth: !!req.headers.authorization }, "Auth middleware");

  try {
    const workerSecret = req.headers["x-worker-secret"];
    if (workerSecret === process.env.WORKER_SECRET) {
      req.user = { _id: "worker-service-account", role: "system" };
      return next();
    }

    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const accessToken = bearerToken || req.cookies?.accessToken || null;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    );

    const user = await User.findById(decoded.userId).select("-password -__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
}
