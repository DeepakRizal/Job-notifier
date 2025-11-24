import express from "express";
import { getAllJobs, getMyJobs, test } from "../controllers/jobController.js";

const router = express.Router();

router.post("/test", test);
router.get("/", getAllJobs);
router.get("/mine", getMyJobs);

export default router;
