import express from "express";
import { getAllJobs, test } from "../controllers/jobController.js";

const router = express.Router();

router.post("/test", test);
router.get("/", getAllJobs);

export default router;
