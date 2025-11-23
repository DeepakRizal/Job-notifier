import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
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
    required: [true, "Job Url is required"],
  },
  source: {
    type: String,
    required: [true, "Job source is required"],
  },
  sourceId: {
    type: String,
  },
  postedAt: {
    type: Date,
  },
  discoveredAt: {
    type: Date,
    default: Date.now,
  },

  rawHTML: {
    type: String,
  },
});

const Job = mongoose.models.Job || mongoose.model("Job", jobsSchema);

export default Job;
