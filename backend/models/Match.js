import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

matchSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Match = mongoose.models.Match || mongoose.model("Match", matchSchema);

export default Match;
