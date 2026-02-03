import { logger } from "../../shared/logger.js";

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
    logger.warn({ err: err?.message }, "tryApplySiteSort failed");
  }
}

/**
 * Set the Naukri "Experience" slider to exactly 0 years.
 * IMPROVED APPROACH: Multiple methods with better accuracy.
 *
 * @param {import('playwright').Page} page - Playwright page instance
 * @param {Object} opts - Options
 * @param {number} opts.maxAttempts - Maximum retry attempts (default: 5)
 * @returns {Promise<{success: boolean, attempts: number, snapshot: Object}>}
 */
export async function setNaukriExperienceSliderToZero(page, opts = {}) {
  const maxAttempts = opts.maxAttempts ?? 5;

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper: Read slider state with more details
  // ─────────────────────────────────────────────────────────────────────────────
  async function readState() {
    return page.evaluate(() => {
      const slider = document.querySelector(".rc-slider");
      if (!slider) return null;

      const handle = slider.querySelector(".handle");
      const innerSpan = handle?.querySelector(".inside span");
      const labelLeft = document.querySelector(".bottom-label .left");
      const labelRight = document.querySelector(".bottom-label .right");
      const track = slider.querySelector(".rc-slider-track");

      // Get handle's left style value
      const handleStyle = handle ? window.getComputedStyle(handle) : null;
      const handleLeft = handleStyle?.left || handle?.style?.left || "unknown";

      // Get track width
      const trackStyle = track ? window.getComputedStyle(track) : null;
      const trackWidth = trackStyle?.width || track?.style?.width || "unknown";

      return {
        hasNotSelectedClass: slider.classList.contains("not-selected"),
        handleInnerText: innerSpan?.textContent?.trim() ?? null,
        labelLeftText: labelLeft?.textContent?.trim() ?? null,
        labelRightText: labelRight?.textContent?.trim() ?? null,
        handleLeft,
        trackWidth,
        ariaValueNow: handle?.getAttribute("aria-valuenow") ?? null,
      };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper: Check if slider is actually at 0
  // ─────────────────────────────────────────────────────────────────────────────
  function isAtZero(state) {
    if (!state) return false;

    // Check multiple conditions - the handle should show "0" when at zero
    const handleShowsZero = state.handleInnerText === "0";
    const sliderActivated = state.hasNotSelectedClass === false;

    logger.debug(
      { handleShowsZero, sliderActivated },
      "Slider state check"
    );

    // We need BOTH: slider activated AND handle shows 0
    return handleShowsZero && sliderActivated;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 1: Click directly on the left edge of the slider track
  // ─────────────────────────────────────────────────────────────────────────────
  async function clickOnLeftEdge() {
    logger.debug("Method 1: Clicking on left edge of slider track");

    const info = await page.evaluate(() => {
      const slider = document.querySelector(".rc-slider");
      const track = slider?.querySelector(".rc-slider-rail") || slider;
      if (!track) return null;

      const rect = track.getBoundingClientRect();
      // Click at exactly 0% position (left edge)
      return {
        x: rect.left + 2, // 2px from left edge
        y: rect.top + rect.height / 2,
        width: rect.width,
        left: rect.left,
      };
    });

    if (info) {
      logger.debug({ x: info.x, y: info.y, width: info.width }, "Clicking at track");
      await page.mouse.click(info.x, info.y);
      await page.waitForTimeout(800);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 2: Drag handle all the way to the left
  // ─────────────────────────────────────────────────────────────────────────────
  async function dragHandleToLeft() {
    logger.debug("Method 2: Dragging handle to the left");

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
        railLeft: railRect.left,
        railWidth: railRect.width,
      };
    });

    if (!coords) {
      logger.debug("Could not get drag coordinates");
      return;
    }

    logger.debug({ handleX: coords.handleX, railLeft: coords.railLeft }, "Handle position");

    // Move to handle, press down, drag to left edge, release
    await page.mouse.move(coords.handleX, coords.handleY);
    await page.waitForTimeout(100);
    await page.mouse.down();
    await page.waitForTimeout(100);

    // Drag in small steps to the left edge (position 0)
    const targetX = coords.railLeft + 2; // 2px from left edge = 0 years
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      const currentX =
        coords.handleX - ((coords.handleX - targetX) * i) / steps;
      await page.mouse.move(currentX, coords.handleY);
      await page.waitForTimeout(30);
    }

    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(800);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 3: Use keyboard after focusing the slider
  // ─────────────────────────────────────────────────────────────────────────────
  async function useKeyboard() {
    logger.debug("Method 3: Using keyboard to set slider to 0");

    try {
      // Focus on the handle
      await page.evaluate(() => {
        const handle = document.querySelector(".rc-slider .handle");
        if (handle) {
          handle.focus();
          handle.click();
        }
      });
      await page.waitForTimeout(300);

      // Press Home key to go to minimum value
      await page.keyboard.press("Home");
      await page.waitForTimeout(500);

      // Or press Left arrow many times to ensure we're at 0
      for (let i = 0; i < 35; i++) {
        await page.keyboard.press("ArrowLeft");
        await page.waitForTimeout(50);
      }
      await page.waitForTimeout(500);
    } catch (e) {
      logger.debug({ err: e.message }, "Keyboard method failed");
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 4: Click on "Fresher" label if it exists
  // ─────────────────────────────────────────────────────────────────────────────
  async function clickFresherLabel() {
    logger.debug("Method 4: Looking for Fresher checkbox/label");

    const clicked = await page.evaluate(() => {
      // Look for fresher checkbox or label
      const fresherLabels = Array.from(
        document.querySelectorAll("label, span, div")
      ).filter((el) => el.textContent?.toLowerCase().includes("fresher"));

      for (const label of fresherLabels) {
        const checkbox =
          label.querySelector('input[type="checkbox"]') ||
          label.closest("label")?.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
          checkbox.click();
          return true;
        }
        // Try clicking the label itself
        if (label.tagName === "LABEL" || label.closest("label")) {
          label.click();
          return true;
        }
      }
      return false;
    });

    if (clicked) {
      logger.debug("Clicked on Fresher option");
      await page.waitForTimeout(800);
    } else {
      logger.debug("No Fresher option found");
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Method 5: Direct position calculation
  // ─────────────────────────────────────────────────────────────────────────────
  async function directPositionClick() {
    logger.debug("Method 5: Direct position calculation for 0 years");

    const info = await page.evaluate(() => {
      const slider = document.querySelector(".rc-slider");
      if (!slider) return null;

      const rect = slider.getBoundingClientRect();
      // Naukri slider is 0-30 years
      // 0 years = 0% = left edge
      const zeroPosition = rect.left + 5; // Small offset from left edge

      return {
        x: zeroPosition,
        y: rect.top + rect.height / 2,
        sliderWidth: rect.width,
        sliderLeft: rect.left,
      };
    });

    if (info) {
      logger.debug({ sliderWidth: info.sliderWidth, x: info.x }, "Direct position click");

      // Double click to ensure it registers
      await page.mouse.click(info.x, info.y);
      await page.waitForTimeout(300);
      await page.mouse.click(info.x, info.y);
      await page.waitForTimeout(800);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main execution
  // ─────────────────────────────────────────────────────────────────────────────
  try {
    logger.info("Starting experience slider adjustment to 0 years");

    // Wait for slider to appear
    logger.debug("Waiting for slider");
    await page
      .waitForSelector(".rc-slider", { timeout: 10000 })
      .catch(() => null);
    await page.waitForTimeout(1500); // Extra wait for React hydration

    // Scroll slider into view
    await page.evaluate(() => {
      const el =
        document.querySelector(".rc-slider") ||
        document.querySelector("[data-type='slider']");
      el?.scrollIntoView({ behavior: "instant", block: "center" });
    });
    await page.waitForTimeout(500);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      logger.debug({ attempt, maxAttempts }, "Slider attempt");

      // Check initial state
      const initialState = await readState();
      logger.debug({ state: initialState }, "Current slider state");

      if (isAtZero(initialState)) {
        logger.info("Already at 0 years");
        return { success: true, attempts: attempt, snapshot: initialState };
      }

      // Try methods in sequence
      await clickOnLeftEdge();
      let state = await readState();
      logger.debug({ handleInnerText: state?.handleInnerText }, "After Method 1");
      if (isAtZero(state)) {
        logger.info("Success with Method 1");
        return { success: true, attempts: attempt, snapshot: state };
      }

      await dragHandleToLeft();
      state = await readState();
      logger.debug({ handleInnerText: state?.handleInnerText }, "After Method 2");
      if (isAtZero(state)) {
        logger.info("Success with Method 2");
        return { success: true, attempts: attempt, snapshot: state };
      }

      await useKeyboard();
      state = await readState();
      logger.debug({ handleInnerText: state?.handleInnerText }, "After Method 3");
      if (isAtZero(state)) {
        logger.info("Success with Method 3");
        return { success: true, attempts: attempt, snapshot: state };
      }

      await clickFresherLabel();
      state = await readState();
      logger.debug({ handleInnerText: state?.handleInnerText }, "After Method 4");
      if (isAtZero(state)) {
        logger.info("Success with Method 4");
        return { success: true, attempts: attempt, snapshot: state };
      }

      await directPositionClick();
      state = await readState();
      logger.debug({ handleInnerText: state?.handleInnerText }, "After Method 5");
      if (isAtZero(state)) {
        logger.info("Success with Method 5");
        return { success: true, attempts: attempt, snapshot: state };
      }

      logger.debug("Waiting before next attempt");
      await page.waitForTimeout(1000);
    }

    const finalState = await readState();
    logger.warn({ finalState }, "All slider attempts failed");
    return { success: false, attempts: maxAttempts, snapshot: finalState };
  } catch (err) {
    logger.error({ err: err.message }, "setNaukriExperienceSliderToZero error");
    return { success: false, attempts: 0, snapshot: null, error: err.message };
  }
}

// Legacy alias for backwards compatibility
export const trySetExperienceSliderV2 = setNaukriExperienceSliderToZero;
