import express from "express";
import {
  getAllJobs,
  getMyJobs,
  discoverJob,
  getAjob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/discover", discoverJob);
router.get("/", getAllJobs);
router.get("/mine", getMyJobs);
router.get("/:id", getAjob);

export default router;
