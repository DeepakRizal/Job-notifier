import express from "express";
import { getAllJobs, getMyJobs, discoverJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/discover", discoverJob);
router.get("/", getAllJobs);
router.get("/mine", getMyJobs);

export default router;
