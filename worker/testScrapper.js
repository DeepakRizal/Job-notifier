import fs from "fs/promises";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./model/Jobs.js";
import { logger } from "../shared/logger.js";

dotenv.config({ path: "../.env" });

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("DB connected");
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to DB");
    process.exit(1);
  }
}

connectDb();

async function run() {
  const html = await fs.readFile(new URL("./testpage.html", import.meta.url));
  const $ = cheerio.load(html);
  const jobs = [];
  $(".job-card").each((i, el) => {
    const title = $(el).find(".job-link").text().trim();
    const url = $(el).find(".job-link").attr("href");
    const company = $(el).find(".company").text().trim();
    const postedAt = $(el).find(".posted").text().trim();

    jobs.push({ title, url, company, postedAt });
  });

  logger.debug({ jobs }, "Parsed jobs");

  for (let job of jobs) {
    job.postedAt = new Date();
    job.source = "Any-job-portal";
    await Job.create(job);
  }

  logger.info("Jobs saved to DB");
}

run().catch((e) => {
  logger.error({ err: e }, "testScrapper failed");
  process.exit(1);
});
