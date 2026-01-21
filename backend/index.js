import dotenv from "dotenv";
//Populating environment variables
dotenv.config({ path: "../.env" });
import express from "express";

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import { apiLimiter } from "./middlewares/rateLimiters.js";

import connectDb from "./db/db.js";
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import queriesRouter from "./routes/queriesRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

//Initialising express app
const app = express();

// Security headers FIRST
app.use(helmet());

//built in middleware to parse request body
app.use(express.json());

//enabling cross origin request for the frontend
app.use(
  cors({
    origin: FRONTEND,
    frontend: true,
    credentials: true,
  })
);

// middleware to parse cookies
app.use(cookieParser());

//connect to db
connectDb();

//api limiter for the whole api
app.use("/api", apiLimiter);

//mounting routes
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
// Queries router: GET / (for worker) doesn't need auth, others do
app.use("/api/queries", queriesRouter);

//Api health route
app.get("/api/health", (req, res) => {
  const dbConnectionState = mongoose.connection.readyState;
  console.log(dbConnectionState);
  const dbStatus =
    dbConnectionState === 1
      ? "connected"
      : dbConnectionState === 2
        ? "connecting"
        : "disconnected";

  res.status(200).json({
    status: "ok",
    uptime: process.uptime().toFixed(0),
    timeStamp: new Date().toISOString(),
    db: dbStatus,
  });
});

//global error handler
app.use(errorHandler);

// getting the port from environment variable
const PORT = process.env.PORT || 4000;

// Starting the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
