import mongoose from "mongoose";

export default async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
