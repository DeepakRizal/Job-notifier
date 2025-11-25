import fs from "fs/promises";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./model/Jobs.js";

dotenv.config({ path: "../.env" });

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected");
  } catch (error) {
    console.log(error);
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

  console.log(jobs);

  for (let job of jobs) {
    job.postedAt = new Date();
    job.source = "Any-job-portal";
    await Job.create(job);
  }

  console.log("Jobs saved to DB");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
