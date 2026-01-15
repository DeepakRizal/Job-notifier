import mongoose from "mongoose";

export default async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected");
  } catch (error) {
    console.log("Failed to connect to mongodb");
    process.exit(1);
  }
}
