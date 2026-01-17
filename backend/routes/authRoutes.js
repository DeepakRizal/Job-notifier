import express from "express";
import {
  getMe,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  removeSkill,
  refreshTokenController,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshTokenController);
router.get("/me", authMiddleware, getMe);
router.patch("/update", authMiddleware, updateUser);
router.patch("/remove-skill", authMiddleware, removeSkill);

export default router;
