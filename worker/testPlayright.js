import playwright from "playwright";
import fs from "fs/promises";

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.naukri.com/nodejs-developer-jobs", {
    waitUntil: "networkidle",
    timeout: 30000,
  });

  await page.waitForSelector(".cust-job-tuple", {
    timeout: 20000,
  });

  const jobs = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll(".cust-job-tuple"));
    return nodes.map((card) => {
      const titleEl = card.querySelector("a.title");
      const companyEl = card.querySelector("a.comp-name");
      const locEl = card.querySelector(".locWdth");
      const descEl = card.querySelector(".job-desc");
      const tagsEls = Array.from(card.querySelectorAll("ul.tags-gt li"));
      const wrapper = card.closest(".srp-jobtuple-wrapper");
      const url = titleEl ? titleEl.href || titleEl.getAttribute("href") : null;

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

  await fs.writeFile("./extracted_jobs.json", JSON.stringify(jobs));

  await browser.close();
})();
