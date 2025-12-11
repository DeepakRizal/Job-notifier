import express from "express";
import { createQueries, getQueries } from "../controllers/queryController.js";

const router = express.Router();

router.post("/", createQueries);
router.get("/", getQueries);

export default router;
