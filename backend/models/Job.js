import mongoose from "mongoose";
import crypto from "crypto";

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
      default: undefined,
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
    owners: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Core sorting
jobsSchema.index({ postedAt: -1 });

// Mode / location filter
jobsSchema.index({ location: 1, postedAt: -1 });

// Experience filtering
jobsSchema.index({ minExperience: 1, maxExperience: 1 });

jobsSchema.index({
  title: "text",
  company: "text",
  description: "text",
  tags: "text",
});

jobsSchema.statics.makeFingerPrint = function ({ url, title, company }) {
  const seed = `${url || ""}|${title || ""}|${company || ""}`;
  return crypto.createHash("sha256").update(seed).digest("hex");
};

const Job = mongoose.models.Job || mongoose.model("Job", jobsSchema);

export default Job;
