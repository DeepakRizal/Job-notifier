import dotenv from "dotenv";
dotenv.config();

import playwright from "playwright";
import {
  tryApplySiteSort,
  trySetExperienceSliderV2,
} from "../lib/playwrightHelpers.js";

function parseExperience(expStr) {
  if (!expStr) return null;
  const m = expStr.match(/(\d+)(?:\s*-\s*(\d+))?/);
  if (!m) return null;
  const min = parseInt(m[1], 10);
  const max = m[2] ? parseInt(m[2], 10) : min;
  return { min, max };
}

function parseRelativeTime(text) {
  if (!text) return null;
  text = text.toLowerCase().trim();
  const now = Date.now();
  const m = text.match(
    /(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/
  );
  if (m) {
    const qty = Number(m[1]);
    const unit = m[2];
    const mul = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };
    return new Date(now - qty * mul[unit]).toISOString();
  }

  const d = new Date(text);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default async function NaukriScraper({
  query,
  url,
  userAgent,
  sort = null,
}) {
  // Build target URL
  const target =
    url ||
    `https://www.naukri.com/${encodeURIComponent(
      query.replace(/\s+/g, "-")
    )}-jobs`;

  // Read Chrome path from environment (optional)
  const chromePath = process.env.CHROME_PATH || null;

  // Browser launch options
  const launchOptions = {
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
    ],
  };

  if (chromePath) {
    launchOptions.executablePath = chromePath;
  }

  // Launch browser
  const browser = await playwright.chromium.launch(launchOptions);
  const context = await browser.newContext({ userAgent });
  const page = await context.newPage();

  try {
    const response = await page.goto(target, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    if (!response) throw new Error("no response");

    await tryApplySiteSort(page, sort);

    if (process.env.SCRAPE_ONLY_FRESHERS === "true") {
      // Wait for page to fully hydrate before manipulating slider
      // This is especially important for the first query where React hasn't initialized yet
      await page.waitForTimeout(800);

      const result = await trySetExperienceSliderV2(page, {
        maxAttempts: 3,
        initTimeout: 15000, // Give up to 10s for slider to appear on first load
      });
      console.log("slider set result:", result);
    }

    // Wait for job cards to appear
    await page
      .waitForSelector(".cust-job-tuple, .srp-jobtuple-wrapper", {
        timeout: 20000,
      })
      .catch(() => null);

    // Scroll a bit to load lazy content
    await page.evaluate(async () => {
      const step = 800;
      for (
        let y = 0;
        y < Math.min(document.body.scrollHeight, 3000);
        y += step
      ) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 250));
      }
    });

    await page.waitForTimeout(800);

    // Extract jobs
    const jobs = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll(".cust-job-tuple"));
      return nodes
        .map((card) => {
          try {
            const titleEl =
              card.querySelector("a.title") ||
              card.querySelector("h2 a") ||
              null;
            const companyEl =
              card.querySelector("a.comp-name") ||
              card.querySelector(".comp-name") ||
              null;
            const locEl =
              card.querySelector(".locWdth") ||
              card.querySelector(".loc") ||
              null;
            const descEl =
              card.querySelector(".job-desc") ||
              card.querySelector(".job-desc *") ||
              null;

            // Try multiple selectors that may contain experience
            const experienceEl =
              card.querySelector(".expwdth") ||
              card.querySelector(".exp") ||
              card.querySelector(".exp-wrap .expwdth") ||
              null;

            // helper to safely get text
            const getText = (el) =>
              el && el.textContent ? el.textContent.trim() : null;

            // prefer title attribute when present (cleaner in many Naukri cards)
            let experienceRaw = null;
            if (experienceEl) {
              experienceRaw =
                (experienceEl.getAttribute &&
                  experienceEl.getAttribute("title")) ||
                getText(experienceEl);
            }

            // normalize: if it's like "7-12 Yrs " -> trim and keep
            if (typeof experienceRaw === "string") {
              experienceRaw = experienceRaw.replace(/\s+/g, " ").trim();
              if (experienceRaw === "") experienceRaw = null;
            }

            const tagsEls =
              Array.from(card.querySelectorAll("ul.tags-gt li")) || [];

            const url = titleEl
              ? titleEl.href || titleEl.getAttribute("href") || null
              : null;

            return {
              title: getText(titleEl),
              company: getText(companyEl),
              location: getText(locEl),
              description: getText(descEl),
              tags: tagsEls
                .map((t) => (t && t.textContent ? t.textContent.trim() : null))
                .filter(Boolean),
              postedText: getText(
                card.querySelector(".job-post-day") ||
                  card.querySelector(".job-posted") ||
                  null
              ),
              url,
              // store raw experience string (or null)
              experience: experienceRaw,
              sourceId:
                (card.closest(".srp-jobtuple-wrapper") || card).getAttribute?.(
                  "data-job-id"
                ) || null,
              rawHTML: card.outerHTML,
            };
          } catch (err) {
            return null;
          }
        })
        .filter(Boolean);
    });

    // Add postedAt ISO date
    for (const j of jobs) {
      j.postedAt = parseRelativeTime(j.postedText);
    }

    // client-side guaranteed sort (newest first, nulls last)
    jobs.sort((a, b) => {
      const ta = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const tb = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return tb - ta;
    });

    await browser.close();
    return jobs;
  } catch (err) {
    await browser.close();
    throw err;
  }
}
