import dotenv from "dotenv";
dotenv.config();

import playwright from "playwright";

async function tryApplySiteSort(page, sort) {
  if (!sort) return;

  try {
    // wait a short time for the sort control to render
    await page.waitForTimeout(300);

    const btn = await page.$("button#filter-sort");
    if (!btn) return;

    // Open the dropdown
    await btn.click().catch(() => null);
    // wait for menu to be visible (ul[data-filter-id="sort"])
    await page
      .waitForSelector('ul[data-filter-id="sort"]', { timeout: 1500 })
      .catch(() => null);

    // For Date option your markup has: <a data-id="filter-sort-f"><span>Date</span></a>
    if (sort === "date") {
      const dateOption = await page.$(
        'ul[data-filter-id="sort"] a[data-id="filter-sort-f"]'
      );
      if (dateOption) {
        await dateOption.click().catch(() => null);
        // wait for page to update (site may reload results via XHR)
        await page.waitForTimeout(900);
        // also wait for networkidle as an extra safety
        await page.waitForLoadState?.("networkidle").catch(() => null);
      }
    } else if (sort === "name") {
      // If you ever map 'name' to relevance / default
      const nameOption = await page.$(
        'ul[data-filter-id="sort"] a[data-id="filter-sort-r"]'
      );
      if (nameOption) {
        await nameOption.click().catch(() => null);
        await page.waitForTimeout(900);
        await page.waitForLoadState?.("networkidle").catch(() => null);
      }
    }
  } catch (err) {
    // best-effort — don't break the scraper if this fails
    console.warn("tryApplySiteSort failed:", err?.message || err);
  }
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
    headless: true,
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
      return nodes.map((card) => {
        const titleEl = card.querySelector("a.title");
        const companyEl = card.querySelector("a.comp-name");
        const locEl = card.querySelector(".locWdth");
        const descEl = card.querySelector(".job-desc");
        const tagsEls = Array.from(card.querySelectorAll("ul.tags-gt li"));
        const wrapper = card.closest(".srp-jobtuple-wrapper");

        const url = titleEl
          ? titleEl.href || titleEl.getAttribute("href")
          : null;

        return {
          title: titleEl ? titleEl.textContent.trim() : null,
          company: companyEl ? companyEl.textContent.trim() : null,
          location: locEl ? locEl.textContent.trim() : null,
          description: descEl ? descEl.textContent.trim() : null,
          tags: tagsEls.map((t) => t.textContent.trim()),
          postedText: (
            card.querySelector(".job-post-day")?.textContent || null
          )?.trim(),
          url,
          sourceId: wrapper ? wrapper.getAttribute("data-job-id") : null,
          rawHTML: card.outerHTML,
        };
      });
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
