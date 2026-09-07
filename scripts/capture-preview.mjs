import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const output = ".visual-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:4175", {
  waitUntil: "networkidle",
});
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector('.sculpture-scene[data-renderer="webgl"]');
await page.waitForTimeout(1800);
await page.getByRole("button", { name: "Pause motion", exact: true }).click();
await page.screenshot({ path: `${output}/desktop-hero.png` });
await page.screenshot({ path: `${output}/desktop-full.png`, fullPage: true });
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () =>
    Number(
      document
        .querySelector('[role="progressbar"]')
        .getAttribute("aria-valuenow"),
    ) > 0,
);
await page.screenshot({ path: `${output}/desktop-work.png` });
await page
  .locator(".case-0")
  .screenshot({ path: `${output}/ai-card-dark.png` });
await page.locator(".case-study").first().click();
await page.screenshot({ path: `${output}/desktop-dialog.png` });
await page.keyboard.press("Escape");
await page.evaluate(() =>
  window.scrollTo({
    top: (document.documentElement.scrollHeight - window.innerHeight) / 2,
    behavior: "instant",
  }),
);
await page.waitForFunction(
  () =>
    document
      .querySelector('[role="progressbar"]')
      .getAttribute("aria-valuenow") === "50",
);
await page.screenshot({ path: `${output}/desktop-progress.png` });
await page
  .getByRole("button", { name: "Use light theme", exact: true })
  .click();
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${output}/desktop-light.png` });
await page.locator(".case-0").scrollIntoViewIfNeeded();
await page
  .locator(".case-0")
  .screenshot({ path: `${output}/ai-card-light.png` });
await page.getByRole("button", { name: "Use dark theme", exact: true }).click();
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(200);
await page.screenshot({ path: `${output}/mobile-hero.png` });
await page.screenshot({ path: `${output}/mobile-full.png`, fullPage: true });
await page.locator(".case-0").scrollIntoViewIfNeeded();
await page
  .locator(".case-0")
  .screenshot({ path: `${output}/ai-card-mobile.png` });
await page.evaluate(() =>
  window.scrollTo({
    top: (document.documentElement.scrollHeight - window.innerHeight) / 2,
    behavior: "instant",
  }),
);
await page.waitForFunction(
  () =>
    document
      .querySelector('[role="progressbar"]')
      .getAttribute("aria-valuenow") === "50",
);
await page.screenshot({ path: `${output}/mobile-progress.png` });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.getByRole("button", { name: "切换至中文", exact: true }).click();
await page.screenshot({ path: `${output}/mobile-zh.png` });
await page.setViewportSize({ width: 320, height: 780 });
await page.screenshot({ path: `${output}/mobile-narrow.png` });
console.log(
  JSON.stringify(
    {
      errors,
      renderer: await page
        .locator(".sculpture-scene")
        .getAttribute("data-renderer"),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
      output,
    },
    null,
    2,
  ),
);
await browser.close();
