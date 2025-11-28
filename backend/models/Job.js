import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    source: {
      type: String,
      required: [true, "Job source is required"],
      trim: true,
      index: true,
    },
    sourceId: {
      type: String,
      trim: true,
      index: true,
    },

    postedAt: {
      type: Date,
    },
    discoveredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    experience: {
      type: {
        min: Number,
        max: Number,
      },
    },
    minExperience: {
      type: Number,
      default: 0,
    },
    maxExperience: {
      type: Number,
    },
    fingerprint: {
      type: String,
    },

    rawHTML: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

jobsSchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });

jobsSchema.index({ fingerprint: 1 }, { unique: true, sparse: true });

jobsSchema.statics.makeFingerPrint = function ({ url, title, company }) {
  const seed = `${url || ""}|${title || ""}|${company || ""}`;
  return crypto.createHash("sha256").update(seed).digest("hex");
};

const Job = mongoose.models.Job || mongoose.model("Job", jobsSchema);

export default Job;
