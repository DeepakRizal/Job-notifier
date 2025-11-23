import express from "express";
import { test } from "../controllers/jobController.js";

const router = express.Router();

router.post("/test", test);

export default router;
