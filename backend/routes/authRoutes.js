import express from "express";
import {
  getMe,
  loginUser,
  updateUser,
  logoutUser,
  removeSkill,
  refreshTokenController,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", refreshTokenController);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", generateRefreshToken);
router.get("/me", authMiddleware, getMe);
router.patch("/update", authMiddleware, updateUser);
router.patch("/remove-skill", authMiddleware, removeSkill);

export default router;
