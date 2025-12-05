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
 * Set the Naukri "Experience" slider to exactly 0 years and keep it stable.
 *
 * @param {import('playwright').Page} page - Playwright page instance
 * @param {Object} opts - Options
 * @param {number} opts.maxAttempts - Maximum retry attempts (default: 5)
 * @param {number} opts.stabilityWindow - Time in ms to verify stability (default: 800)
 * @param {string} opts.applySelector - Selector for Apply button (optional)
 * @param {string} opts.screenshotPath - Path to save final screenshot (default: 'slider-final.png')
 * @returns {Promise<{success: boolean, attempts: number, snapshot: Object}>}
 */
export async function setNaukriExperienceSliderToZero(page, opts = {}) {
  const maxAttempts = opts.maxAttempts ?? 5;
  const stabilityWindow = opts.stabilityWindow ?? 800;
  const applySelector =
    process.env.NAUKRI_APPLY_FILTER_SELECTOR || opts.applySelector || null;
  const screenshotPath = opts.screenshotPath ?? "slider-final.png";
  const initTimeout = opts.initTimeout ?? 8000; // Wait up to 8s for slider to appear

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 0: Wait for slider elements to appear in DOM (critical for first query)
  // ─────────────────────────────────────────────────────────────────────────────
  async function waitForSliderElements() {
    const sliderSelectors = [
      ".styles_filterContainer__4aQaD[data-type='slider'] .rc-slider",
      ".styles_filterOptns__1vq77[data-filter-id='experience'] .rc-slider",
      ".rc-slider",
    ];

    console.log("Waiting for slider elements to appear in DOM...");

    // Try each selector
    for (const selector of sliderSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: initTimeout / 3 });
        console.log(`Found slider with selector: ${selector}`);

        // Also wait for handle to be present
        const handleSelector = `${selector} .handle, ${selector} .rc-slider-handle`;
        await page
          .waitForSelector(handleSelector, { timeout: 2000 })
          .catch(() => null);

        // Extra wait for React hydration
        await page.waitForTimeout(500);
        return true;
      } catch (e) {
        // Try next selector
      }
    }

    // Fallback: just wait and hope
    console.warn(
      "Could not find slider with known selectors, waiting anyway..."
    );
    await page.waitForTimeout(2000);
    return false;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 1: Ensure viewport and visibility
  // ─────────────────────────────────────────────────────────────────────────────
  async function ensureViewportAndVisibility() {
    await page.setViewportSize({ width: 1200, height: 900 }).catch(() => null);

    await page.evaluate(() => {
      const container = document.querySelector(
        ".styles_filterContainer__4aQaD"
      );
      if (container)
        container.scrollIntoView({ behavior: "instant", block: "center" });
    });

    await page.waitForTimeout(150);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 2: Compute exact coordinates (run inside page context)
  // ─────────────────────────────────────────────────────────────────────────────
  async function computeCoordinates() {
    return page.evaluate(() => {
      try {
        const slider =
          document.querySelector(
            ".styles_filterContainer__4aQaD[data-type='slider'] .rc-slider"
          ) || document.querySelector(".rc-slider");
        if (!slider) return null;

        const handle = slider.querySelector(".handle, .rc-slider-handle");
        const rail = slider.querySelector(".rc-slider-rail") || slider;
        if (!handle || !rail) return null;

        const handleRect = handle.getBoundingClientRect();
        const railRect = rail.getBoundingClientRect();

        const start = {
          x: handleRect.left + handleRect.width / 2,
          y: handleRect.top + handleRect.height / 2,
        };

        // Target: exact left-center of the rail (where 0 should be)
        const target = {
          x: railRect.left + handleRect.width / 2,
          y: start.y,
        };

        return {
          start,
          target,
          railLeft: railRect.left,
          handleWidth: handleRect.width,
        };
      } catch (e) {
        return null;
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 3: Perform pointer sequence with smooth moves and overshoot
  // ─────────────────────────────────────────────────────────────────────────────
  async function performPointerSequence(coords) {
    if (!coords) return false;

    const { start, target, railLeft, handleWidth } = coords;
    const overshootX = Math.max(railLeft - 8, 2);

    // Move pointer to start position
    await page.mouse.move(start.x, start.y);
    await page.waitForTimeout(50);

    // Dispatch pointerdown at start
    await page.mouse.down();
    await page.waitForTimeout(80);

    // Move in smooth steps to overshoot (left of target)
    await page.mouse.move(overshootX, start.y, { steps: 6 });
    await page.waitForTimeout(60);

    // Move to target + 2px
    await page.mouse.move(target.x + 2, target.y, { steps: 4 });
    await page.waitForTimeout(40);

    // Move to exact target
    await page.mouse.move(target.x, target.y, { steps: 3 });
    await page.waitForTimeout(120);

    // Dispatch pointerup and mouseup
    await page.mouse.up();
    await page.waitForTimeout(80);

    // Also dispatch pointer events directly on handle with clientX/clientY
    await page.evaluate(
      ({ tx, ty }) => {
        const slider =
          document.querySelector(
            ".styles_filterContainer__4aQaD[data-type='slider'] .rc-slider"
          ) || document.querySelector(".rc-slider");
        if (!slider) return;

        const handle = slider.querySelector(".handle, .rc-slider-handle");
        if (!handle) return;

        const eventOpts = {
          bubbles: true,
          cancelable: true,
          pointerType: "mouse",
          button: 0,
          clientX: tx,
          clientY: ty,
        };

        handle.dispatchEvent(new PointerEvent("pointerdown", eventOpts));
        handle.dispatchEvent(new PointerEvent("pointermove", eventOpts));
        handle.dispatchEvent(new PointerEvent("pointerup", eventOpts));
        handle.dispatchEvent(
          new MouseEvent("mouseup", { bubbles: true, clientX: tx, clientY: ty })
        );
      },
      { tx: target.x, ty: target.y }
    );

    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 4: Dispatch DOM fallback events (force styles + input events)
  // ─────────────────────────────────────────────────────────────────────────────
  async function dispatchDOMFallback() {
    return page.evaluate(() => {
      try {
        const root =
          document.querySelector(
            ".styles_filterContainer__4aQaD[data-type='slider']"
          ) ||
          document.querySelector(
            ".styles_filterOptns__1vq77[data-filter-id='experience']"
          ) ||
          document.querySelector(".rc-slider");
        if (!root) return false;

        const slider = root.querySelector(".rc-slider") || root;
        const handle = slider.querySelector(".handle, .rc-slider-handle");
        const track = slider.querySelector(".rc-slider-track");
        const labelLeft =
          root.querySelector(".bottom-label .left") ||
          root.querySelector(".bottom-label span:first-child");

        // Force handle position
        if (handle) {
          handle.style.left = "calc(0% - 15px)";
          handle.setAttribute("aria-valuenow", "0");
        }

        // Force track position
        if (track) {
          track.style.left = "0%";
          track.style.width = "0%";
        }

        // Force label text
        if (labelLeft) {
          labelLeft.textContent = "0 Yrs";
        }

        // Find and update any input element
        const input = slider.querySelector(
          'input[type="range"], input[name*="experience"], input[data-filter="experience"], input'
        );
        if (input) {
          const minVal =
            input.min !== undefined && input.min !== "" ? input.min : "0";
          input.value = minVal;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // Final pointer events on handle
        if (handle) {
          handle.dispatchEvent(
            new PointerEvent("pointerup", { bubbles: true, cancelable: true })
          );
          handle.dispatchEvent(
            new MouseEvent("mouseup", { bubbles: true, cancelable: true })
          );
        }

        return true;
      } catch (e) {
        return false;
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 5: Click left-rail fallback
  // ─────────────────────────────────────────────────────────────────────────────
  async function clickLeftRailFallback(coords) {
    if (!coords) return;
    const clickX = coords.railLeft + 4;
    const clickY = coords.start.y;
    await page.mouse.click(clickX, clickY).catch(() => null);
    await page.waitForTimeout(150);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 6: Read current slider state
  // ─────────────────────────────────────────────────────────────────────────────
  async function readState() {
    return page.evaluate(() => {
      try {
        const root =
          document.querySelector(
            ".styles_filterContainer__4aQaD[data-type='slider']"
          ) ||
          document.querySelector(
            ".styles_filterOptns__1vq77[data-filter-id='experience']"
          ) ||
          document.querySelector(".rc-slider");
        if (!root) return null;

        const slider = root.querySelector(".rc-slider") || root;
        const handle = slider.querySelector(".handle, .rc-slider-handle");
        const track = slider.querySelector(".rc-slider-track");
        const labelLeft =
          root.querySelector(".bottom-label .left") ||
          root.querySelector(".bottom-label span:first-child");
        const input = slider.querySelector(
          'input[type="range"], input[name*="experience"], input'
        );

        return {
          handleLeft: handle?.style?.left ?? null,
          trackWidth: track?.style?.width ?? null,
          labelText: labelLeft?.textContent?.trim() ?? null,
          inputValue: input?.value ?? null,
        };
      } catch (e) {
        return null;
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Step 7: Verify stability (at least one indicator shows zero)
  // ─────────────────────────────────────────────────────────────────────────────
  function isZeroLike(snapshot) {
    if (!snapshot) return false;

    const { handleLeft, labelText, inputValue } = snapshot;

    // Check handle style
    const handleOk =
      handleLeft &&
      (handleLeft.includes("calc(0%") ||
        handleLeft === "0%" ||
        handleLeft.trim() === "0");

    // Check label text (matches "0" as a word boundary)
    const labelOk = labelText && /\b0\b/.test(labelText);

    // Check input value
    const inputOk = inputValue === "0" || inputValue === 0;

    return handleOk || labelOk || inputOk;
  }

  async function verifyStability() {
    // Wait for network idle first
    await page.waitForTimeout(200);
    await page.waitForLoadState?.("networkidle").catch(() => null);
    await page.waitForTimeout(stabilityWindow);

    const snapshot = await readState();
    return { stable: isZeroLike(snapshot), snapshot };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main execution loop
  // ─────────────────────────────────────────────────────────────────────────────
  try {
    // CRITICAL: Wait for slider to appear in DOM before any attempts
    // This fixes the "first query" issue where the page hasn't fully hydrated yet
    await waitForSliderElements();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const backoff = 150 + attempt * 100;

      // Step 1: Ensure viewport and visibility
      await ensureViewportAndVisibility();

      // Step 2: Compute coordinates
      const coords = await computeCoordinates();
      if (!coords) {
        console.warn(
          `setNaukriExperienceSliderToZero attempt ${attempt}: could not find slider elements`
        );
        await page.waitForTimeout(backoff);
        continue;
      }

      // Step 3: Perform pointer sequence
      await performPointerSequence(coords);

      // Step 4: DOM fallback
      await dispatchDOMFallback();

      // Step 5: Click left-rail fallback
      await clickLeftRailFallback(coords);

      // Step 6 & 7: Wait and verify stability
      const { stable, snapshot } = await verifyStability();

      console.log(
        `setNaukriExperienceSliderToZero attempt ${attempt} => stable=${stable}, snapshot=`,
        snapshot
      );

      if (stable) {
        // Step 8: Click Apply button if provided
        if (applySelector) {
          await page.click(applySelector, { timeout: 1000 }).catch(() => null);
          await page.waitForLoadState?.("networkidle").catch(() => null);
        }

        // Take screenshot of slider area
        try {
          const sliderEl = await page.$(
            ".styles_filterContainer__4aQaD[data-type='slider'], .rc-slider"
          );
          if (sliderEl) {
            await sliderEl
              .screenshot({ path: screenshotPath })
              .catch(() => null);
          } else {
            await page.screenshot({ path: screenshotPath }).catch(() => null);
          }
        } catch (e) {
          // screenshot is optional
        }

        const result = {
          success: true,
          attempts: attempt,
          snapshot,
        };
        console.log("setNaukriExperienceSliderToZero result:", result);
        return result;
      }

      // Backoff before next attempt
      await page.waitForTimeout(backoff);
    }

    // All attempts exhausted
    const finalSnapshot = await readState();
    console.warn(
      "setNaukriExperienceSliderToZero: attempts exhausted, could not keep slider at 0"
    );
    return {
      success: false,
      attempts: maxAttempts,
      snapshot: finalSnapshot,
    };
  } catch (err) {
    console.warn(
      "setNaukriExperienceSliderToZero failed:",
      err?.message || err
    );
    return {
      success: false,
      attempts: 0,
      snapshot: null,
      error: err?.message || String(err),
    };
  }
}

// Legacy alias for backwards compatibility
export const trySetExperienceSliderV2 = setNaukriExperienceSliderToZero;
