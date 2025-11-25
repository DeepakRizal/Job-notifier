import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  // 1) Check for worker secret (bypass normal cookie login)
  const workerSecret = req.headers["x-worker-secret"];
  if (workerSecret && workerSecret === process.env.WORKER_SECRET) {
    req.user = { _id: "worker-service-account", role: "system" };
    return next();
  }

  //destructure the token
  const { token } = req.cookies;

  //check if the token exists
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please login to perform this action",
    });
  }

  //decode the token using jwt library
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //get the user from the database
  const user = await User.findOne({ _id: decoded.userId }).select(
    "-password -__v"
  );

  // if there is no user then return a error message
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found. Please log in again.",
    });
  }

  //attach the user to the request body
  req.user = user;
  next();
}
