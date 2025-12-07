export async function tryApplySiteSort(page, sort) {
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

/**
 * Set the Naukri "Experience" slider to exactly 0 years.
 * SIMPLE APPROACH: Click directly on the rail at 0 position.
 *
 * @param {import('playwright').Page} page - Playwright page instance
 * @param {Object} opts - Options
 * @param {number} opts.maxAttempts - Maximum retry attempts (default: 5)
 * @returns {Promise<{success: boolean, attempts: number, snapshot: Object}>}
 */
export async function setNaukriExperienceSliderToZero(page, opts = {}) {
  const maxAttempts = opts.maxAttempts ?? 5;

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper: Read slider state
  // ─────────────────────────────────────────────────────────────────────────────
  async function readState() {
    return page.evaluate(() => {
      const slider = document.querySelector(".rc-slider");
      if (!slider) return null;

      const handle = slider.querySelector(".handle");
      const innerSpan = handle?.querySelector(".inside span");
      const labelRight = document.querySelector(".bottom-label .right");

      return {
        hasNotSelectedClass: slider.classList.contains("not-selected"),
        handleInnerText: innerSpan?.textContent?.trim() ?? null,
        labelRightText: labelRight?.textContent?.trim() ?? null,
      };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper: Check if slider is actually at 0
  // ─────────────────────────────────────────────────────────────────────────────
  function isAtZero(state) {
    if (!state) return false;
    // Slider is at 0 when: no "not-selected" class, OR handle shows "0", OR right label is "30 Yrs"
    return (
      state.hasNotSelectedClass === false ||
      state.handleInnerText === "0" ||
      state.labelRightText === "30 Yrs"
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 1: Click on the rail at the ABSOLUTE leftmost position (0%)
  // ─────────────────────────────────────────────────────────────────────────────
  async function clickOnRailAtZero() {
    console.log("Method 1: Clicking on rail at 0 position...");

    const railInfo = await page.evaluate(() => {
      const rail = document.querySelector(".rc-slider-rail");
      if (!rail) return null;
      const rect = rail.getBoundingClientRect();
      // Click at the VERY LEFT edge (0%), not +5px which lands at ~1 year
      return { x: rect.left + 1, y: rect.top + rect.height / 2 };
    });

    if (railInfo) {
      await page.mouse.click(railInfo.x, railInfo.y);
      await page.waitForTimeout(500);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 2: Use Playwright's built-in click on the slider element
  // ─────────────────────────────────────────────────────────────────────────────
  async function clickSliderElement() {
    console.log("Method 2: Using Playwright click on slider...");

    try {
      const slider = await page.$(".rc-slider");
      if (slider) {
        const box = await slider.boundingBox();
        if (box) {
          // Click at the VERY LEFT edge of the slider (0%)
          await page.mouse.click(box.x + 1, box.y + box.height / 2);
          await page.waitForTimeout(500);
        }
      }
    } catch (e) {
      console.log("Method 2 failed:", e.message);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 3: Drag the handle with simple mouse operations - drag PAST left edge
  // ─────────────────────────────────────────────────────────────────────────────
  async function dragHandle() {
    console.log("Method 3: Dragging handle to 0...");

    const coords = await page.evaluate(() => {
      const slider = document.querySelector(".rc-slider");
      const handle = slider?.querySelector(".handle");
      const rail = slider?.querySelector(".rc-slider-rail");
      if (!handle || !rail) return null;

      const handleRect = handle.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();

      return {
        handleX: handleRect.left + handleRect.width / 2,
        handleY: handleRect.top + handleRect.height / 2,
        // Target PAST the left edge to ensure we hit 0
        targetX: railRect.left - 10,
        railRight: railRect.right - 5,
      };
    });

    if (!coords) return;

    // First drag to the RIGHT to "activate" the slider
    await page.mouse.move(coords.handleX, coords.handleY);
    await page.mouse.down();
    await page.mouse.move(coords.railRight, coords.handleY, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    // Re-get handle position
    const newCoords = await page.evaluate(() => {
      const handle = document.querySelector(".rc-slider .handle");
      if (!handle) return null;
      const rect = handle.getBoundingClientRect();
      const rail = document.querySelector(".rc-slider-rail");
      const railRect = rail?.getBoundingClientRect();
      return {
        handleX: rect.left + rect.width / 2,
        handleY: rect.top + rect.height / 2,
        // Drag PAST the left edge to ensure we hit 0
        targetX: railRect ? railRect.left - 10 : rect.left - 100,
      };
    });

    if (!newCoords) return;

    // Now drag to the LEFT (PAST the edge to ensure 0)
    await page.mouse.move(newCoords.handleX, newCoords.handleY);
    await page.mouse.down();
    await page.mouse.move(newCoords.targetX, newCoords.handleY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 4: Direct DOM manipulation + trigger React events
  // ─────────────────────────────────────────────────────────────────────────────
  async function forceDOM() {
    console.log("Method 4: Forcing DOM state...");

    await page.evaluate(() => {
      const slider = document.querySelector(".rc-slider");
      const handle = slider?.querySelector(".handle");
      const innerSpan = handle?.querySelector(".inside span");
      const labelRight = document.querySelector(".bottom-label .right");
      const track = slider?.querySelector(".rc-slider-track");

      if (slider) slider.classList.remove("not-selected");
      if (handle) {
        handle.style.left = "calc(0% - 15px)";
        handle.setAttribute("aria-valuenow", "0");
      }
      if (innerSpan) {
        innerSpan.classList.remove("small");
        innerSpan.textContent = "0";
      }
      if (labelRight) labelRight.textContent = "30 Yrs";
      if (track) {
        track.style.left = "0%";
        track.style.width = "0%";
      }

      // Try to trigger React's onChange
      if (slider) {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: slider.getBoundingClientRect().left + 5,
          clientY: slider.getBoundingClientRect().top + 10,
        });
        slider.dispatchEvent(event);
      }
    });

    await page.waitForTimeout(300);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main execution
  // ─────────────────────────────────────────────────────────────────────────────
  try {
    // Wait for slider to appear
    console.log("Waiting for slider...");
    await page
      .waitForSelector(".rc-slider", { timeout: 10000 })
      .catch(() => null);
    await page.waitForTimeout(1000); // Extra wait for React hydration

    // Scroll slider into view
    await page.evaluate(() => {
      const el = document.querySelector(
        ".styles_filterContainer__4aQaD[data-type='slider']"
      );
      el?.scrollIntoView({ behavior: "instant", block: "center" });
    });
    await page.waitForTimeout(300);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`\n=== Attempt ${attempt}/${maxAttempts} ===`);

      // Check initial state
      const initialState = await readState();
      console.log("Initial state:", initialState);

      if (isAtZero(initialState)) {
        console.log("Already at 0! Verifying...");
        await page.waitForTimeout(500);
        const verifyState = await readState();
        if (isAtZero(verifyState)) {
          console.log("Confirmed at 0!");
          return { success: true, attempts: attempt, snapshot: verifyState };
        }
      }

      // Try all methods in sequence
      await clickOnRailAtZero();
      let state = await readState();
      console.log("After Method 1:", state);
      if (isAtZero(state)) {
        await page.waitForTimeout(500);
        return { success: true, attempts: attempt, snapshot: state };
      }

      await clickSliderElement();
      state = await readState();
      console.log("After Method 2:", state);
      if (isAtZero(state)) {
        await page.waitForTimeout(500);
        return { success: true, attempts: attempt, snapshot: state };
      }

      await dragHandle();
      state = await readState();
      console.log("After Method 3:", state);
      if (isAtZero(state)) {
        await page.waitForTimeout(500);
        return { success: true, attempts: attempt, snapshot: state };
      }

      await forceDOM();
      state = await readState();
      console.log("After Method 4:", state);
      if (isAtZero(state)) {
        await page.waitForTimeout(500);
        return { success: true, attempts: attempt, snapshot: state };
      }

      // Wait before next attempt
      await page.waitForTimeout(500 + attempt * 200);
    }

    const finalState = await readState();
    console.log("All attempts failed. Final state:", finalState);
    return { success: false, attempts: maxAttempts, snapshot: finalState };
  } catch (err) {
    console.error("setNaukriExperienceSliderToZero error:", err.message);
    return { success: false, attempts: 0, snapshot: null, error: err.message };
  }
}

// Legacy alias for backwards compatibility
export const trySetExperienceSliderV2 = setNaukriExperienceSliderToZero;
