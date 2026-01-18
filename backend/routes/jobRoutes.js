import express from "express";
import {
  getAllJobs,
  getMyJobs,
  discoverJob,
  getAjob,
} from "../controllers/jobController.js";
import { workerLimiter } from "../middlewares/rateLimiters.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/discover", workerLimiter, authMiddleware, discoverJob);
router.get("/", getAllJobs);
router.get("/mine", getMyJobs);
router.get("/:id", getAjob);

export default router;
