import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDb from "./db/db.js";
//Populating environment variables
dotenv.config({ path: "../.env" });

//Initialising express app
const app = express();

//built in middleware to parse request body
app.use(express.json());

//connect to db
connectDb();

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

// getting the port from environment variable
const PORT = process.env.PORT || 4000;

// Starting the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
