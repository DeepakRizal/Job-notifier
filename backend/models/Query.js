import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    index: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

// Compound unique index: same query can exist for different users
QuerySchema.index({ query: 1, owner: 1 }, { unique: true });

export default mongoose.models.Query || mongoose.model("Query", QuerySchema);
