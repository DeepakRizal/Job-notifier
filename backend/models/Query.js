import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastScrapedAt: {
    type: Date,
  },
});

export default mongoose.models.Query || mongoose.model("Query", QuerySchema);
