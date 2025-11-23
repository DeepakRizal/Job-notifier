import express from "express";
import {
  getMe,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);
router.patch("/update", authMiddleware, updateUser);

export default router;
