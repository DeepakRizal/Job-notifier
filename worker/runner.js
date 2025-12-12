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
const SCRAPE_INTERVAL = Number(process.env.SCRAPE_INTERVAL || 300) * 1000; // 5 minutes
const QUERY_POLL_INTERVAL =
  Number(process.env.QUERY_POLL_INTERVAL || 30) * 1000; // 30 seconds
const LRU_SIZE = Number(process.env.WORKER_LRU_SIZE || 1000);

//creating least recently used cached
const recent = LRU(LRU_SIZE);

// function to make the unique fingerprint
function makeFingerprint(job) {
  const seed = (
    job.url || `${job.title || ""}|${job.company || ""}`
  ).toString();
  return crypto.createHash("sha256").update(seed).digest("hex");
}

// function to normalize query to canonical form
function normalizeQuery(query) {
  return query.trim().toLowerCase();
}

// function to post job that have scrapped by the scrapper
async function postJob(job, ownerIds = []) {
  try {
    const jobPayload = { ...job };
    // Send all owners for this job
    if (ownerIds.length > 0) {
      jobPayload.owners = ownerIds;
    }

    const res = await axios.post(`${BACKEND}/api/jobs/discover`, jobPayload, {
      headers: {
        "User-Agent": USER_AGENT,
        "x-worker-secret": process.env.WORKER_SECRET,
      },
      timeout: 20000,
    });
    const ownerCount = ownerIds.length;
    console.log(
      "POST",
      res.status,
      job.title?.slice(0, 60) || job.sourceId || job.fingerprint?.slice(0, 8),
      ownerCount > 0 ? `[${ownerCount} owner(s)]` : ""
    );
    return true;
  } catch (err) {
    console.error("POST ERROR", err?.response?.status || "", err?.message);
    return false;
  }
}

// function to process the jobs array
async function processJobs(jobs, ownerIds = []) {
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
    // Include all owners who have this query
    const ok = await postJob(job, ownerIds);
    if (ok) recent.set(job.fingerprint, Date.now());

    // random short delay between posts
    const delay = 500 + Math.floor(Math.random() * 1500);
    await new Promise((r) => setTimeout(r, delay));
  }
}

// function to fetch queries from backend
async function fetchQueries() {
  try {
    const res = await axios.get(`${BACKEND}/api/queries`, {
      headers: {
        "x-worker-secret": process.env.WORKER_SECRET,
      },
      timeout: 10000,
    });

    if (res.data && res.data.success && res.data.queries) {
      return res.data.queries;
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch queries from backend:", err?.message || err);
    // Fallback to environment variable if backend fails
    const fallbackQueries = (process.env.SCRAPE_QUERIES || "nodejs developer")
      .split(",")
      .map((s) => ({ query: s.trim(), owner: null }))
      .filter((q) => q.query);
    return fallbackQueries;
  }
}

// Cache of queries grouped by canonical form
let queryCache = new Map(); // Map<canonicalQuery, Set<ownerId>>

// Function to deduplicate queries and group by canonical form
function deduplicateQueries(queries) {
  const grouped = new Map(); // Map<canonicalQuery, Set<ownerId>>

  for (const queryObj of queries) {
    const queryText = typeof queryObj === "string" ? queryObj : queryObj.query;
    const ownerId = typeof queryObj === "object" ? queryObj.owner : null;

    if (!queryText) continue;

    const canonical = normalizeQuery(queryText);
    if (!grouped.has(canonical)) {
      grouped.set(canonical, new Set());
    }
    if (ownerId) {
      grouped.get(canonical).add(ownerId);
    }
  }

  return grouped;
}

async function runOnce() {
  // Use cached queries (updated every 30 seconds via polling)
  const queriesToScrape = Array.from(queryCache.entries());

  if (queriesToScrape.length === 0) {
    console.log("No active queries found. Skipping scrape cycle.");
    return;
  }

  const totalQueries = queriesToScrape.length;
  const totalOwners = queriesToScrape.reduce(
    (sum, [, owners]) => sum + owners.size,
    0
  );
  console.log(
    `Scraping ${totalQueries} unique query(ies) for ${totalOwners} total owner(s)`
  );

  for (const [canonicalQuery, ownerIds] of queriesToScrape) {
    const ownerArray = Array.from(ownerIds);
    console.log(
      `Scraping query: "${canonicalQuery}" [${ownerArray.length} owner(s)]`
    );

    try {
      const jobs = await Naukriscraper({
        query: canonicalQuery,
        userAgent: USER_AGENT,
        sort: "date",
      });
      console.log(
        `Found ${jobs.length} jobs for "${canonicalQuery}" (serving ${ownerArray.length} owner(s))`
      );
      await processJobs(jobs, ownerArray);
    } catch (err) {
      console.error("Scrape error", err?.message || err);
    }

    // wait between queries
    await new Promise((r) =>
      setTimeout(r, 800 + Math.floor(Math.random() * 1200))
    );
  }
}

// Function to poll backend for queries every 30 seconds
async function pollQueries() {
  try {
    const queries = await fetchQueries();
    const grouped = deduplicateQueries(queries);
    queryCache = grouped;

    const totalQueries = grouped.size;
    const totalOwners = Array.from(grouped.values()).reduce(
      (sum, owners) => sum + owners.size,
      0
    );
    console.log(
      `[Query Poll] Updated: ${totalQueries} unique query(ies), ${totalOwners} total owner(s)`
    );
  } catch (err) {
    console.error(
      "[Query Poll] Failed to update queries:",
      err?.message || err
    );
  }
}

async function main() {
  console.log("Worker starting — backend:", BACKEND);
  console.log(
    `Configuration: Scrape interval: ${SCRAPE_INTERVAL / 1000}s, Query poll: ${
      QUERY_POLL_INTERVAL / 1000
    }s`
  );

  // Initial query fetch
  await pollQueries();

  // Poll queries from backend every 30 seconds
  setInterval(
    () => pollQueries().catch((e) => console.error("pollQueries failure", e)),
    QUERY_POLL_INTERVAL
  );

  // Initial scrape
  await runOnce();

  // Scrape after every 5 minutes (using cached queries)
  setInterval(
    () => runOnce().catch((e) => console.error("runOnce failure", e)),
    SCRAPE_INTERVAL
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
