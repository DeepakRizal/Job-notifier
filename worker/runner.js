#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();

import Naukriscraper from "./scrapers/naukri.js";
import LRU from "./lib/lruCache.js";
import axios from "axios";
import crypto from "crypto";

const BACKEND = process.env.WORKER_BACKEND_URL || "http://localhost:4000";
const USER_AGENT =
  process.env.USER_AGENT ||
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const SCRAPE_INTERVAL = Number(process.env.SCRAPE_INTERVAL || 300) * 1000;
const LRU_SIZE = Number(process.env.WORKER_LRU_SIZE || 1000);

const recent = LRU(LRU_SIZE);

function makeFingerprint(job) {
  const seed = (
    job.url || `${job.title || ""}|${job.company || ""}`
  ).toString();
  return crypto.createHash("sha256").update(seed).digest("hex");
}

async function postJob(job) {
  try {
    const res = await axios.post(`${BACKEND}/api/jobs/test`, job, {
      headers: {
        "User-Agent": USER_AGENT,
        "x-worker-secret": process.env.WORKER_SECRET,
      },
      timeout: 20000,
    });
    console.log(
      "POST",
      res.status,
      job.title?.slice(0, 60) || job.sourceId || job.fingerprint?.slice(0, 8)
    );
    return true;
  } catch (err) {
    console.error("POST ERROR", err?.response?.status || "", err?.message);
    return false;
  }
}

async function processJobs(jobs) {
  for (const j of jobs) {
    const job = { ...j, source: "naukri" };
    job.fingerprint = makeFingerprint(job);

    if (recent.has(job.fingerprint)) {
      console.log(
        "skip local recent:",
        job.title?.slice(0, 60) || job.sourceId || job.fingerprint.slice(0, 8)
      );
      continue;
    }

    // Post to backend (backend is expected to upsert by url/sourceId/fingerprint)
    const ok = await postJob(job);
    if (ok) recent.set(job.fingerprint, Date.now());

    // random short delay between posts
    const delay = 500 + Math.floor(Math.random() * 1500);
    await new Promise((r) => setTimeout(r, delay));
  }
}

async function runOnce() {
  const queries = (process.env.SCRAPE_QUERIES || "nodejs developer")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const q of queries) {
    console.log("Scraping query:", q);
    try {
      const jobs = await Naukriscraper({ query: q, userAgent: USER_AGENT });
      console.log("Found", jobs.length, "jobs for", q);
      await processJobs(jobs);
    } catch (err) {
      console.error("Scrape error", err?.message || err);
    }

    // wait between queries
    await new Promise((r) =>
      setTimeout(r, 800 + Math.floor(Math.random() * 1200))
    );
  }
}

async function main() {
  console.log("Worker starting — backend:", BACKEND);
  await runOnce();
  setInterval(
    () => runOnce().catch((e) => console.error("runOnce failure", e)),
    SCRAPE_INTERVAL
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
