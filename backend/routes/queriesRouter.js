import express from "express";
import {
  createQueries,
  getQueries,
  getMyQueries,
  deleteQuery,
  updateQuery,
} from "../controllers/queryController.js";
import authMiddleware from "../middlewares/auth.js";
import { workerLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

// Worker endpoint (no auth middleware, uses worker secret)
router.get("/", workerLimiter, getQueries);

// User endpoints (require auth middleware)
router.post("/", authMiddleware, createQueries);
router.get("/mine", authMiddleware, getMyQueries);
router.delete("/:id", authMiddleware, deleteQuery);

router.patch("/:id", authMiddleware, updateQuery);

export default router;
