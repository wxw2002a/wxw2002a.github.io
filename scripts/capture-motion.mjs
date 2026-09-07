import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const output = ".visual-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const url = process.env.PREVIEW_URL || "http://127.0.0.1:4175";
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector('.sculpture-scene[data-renderer="webgl"]');
const scene = page.locator(".sculpture-scene");
await page.waitForTimeout(2000);
await page.screenshot({ path: `${output}/motion-hero.png` });
const firstFrame = await scene.screenshot();
await page.waitForTimeout(750);
const secondFrame = await scene.screenshot();
await page.getByRole("button", { name: "Explode cube", exact: true }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${output}/motion-exploded.png` });
await page.getByRole("button", { name: "Assemble cube", exact: true }).click();
await page.locator(".case-0").scrollIntoViewIfNeeded();
const preview = page.locator(".case-0 .project-visual");
const bounds = await preview.boundingBox();
await page.mouse.move(
  bounds.x + bounds.width * 0.65,
  bounds.y + bounds.height * 0.3,
);
await page.waitForTimeout(350);
await page.screenshot({ path: `${output}/motion-card-hover.png` });
const sweep = page.locator(".ai-reveal-sweep");
await sweep.evaluate(
  (element) => (element.getAnimations()[0].currentTime = 3100),
);
await page.screenshot({ path: `${output}/motion-ai-scan.png` });
await page.mouse.move(10, 10);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.getByRole("button", { name: "Pause motion", exact: true }).click();
await page.waitForTimeout(300);
const pausedFirst = await scene.screenshot();
await page.waitForTimeout(600);
const pausedSecond = await scene.screenshot();
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const report = {
  errors,
  livePixelsChange: hash(firstFrame) !== hash(secondFrame),
  pausedPixelsStable: hash(pausedFirst) === hash(pausedSecond),
};
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  colorScheme: "dark",
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(url, { waitUntil: "networkidle" });
await mobilePage.evaluate(() => document.fonts.ready);
await mobilePage
  .getByRole("button", { name: "Explode cube", exact: true })
  .click();
await mobilePage.waitForTimeout(1500);
await mobilePage.screenshot({ path: `${output}/motion-mobile.png` });
await mobilePage.locator(".case-0").scrollIntoViewIfNeeded();
await mobilePage.screenshot({ path: `${output}/motion-mobile-work.png` });
report.mobileOverflow = await mobilePage.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth,
);
await writeFile(
  `${output}/motion-report.json`,
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (
  errors.length ||
  !report.livePixelsChange ||
  !report.pausedPixelsStable ||
  report.mobileOverflow
)
  process.exitCode = 1;
