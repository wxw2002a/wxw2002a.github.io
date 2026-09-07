import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

async function expectNoOverflow(page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    "The page must fit the viewport without horizontal scrolling",
  ).toBeLessThanOrEqual(1);
}

test("shows the revised résumé and preserves the additional engineering projects", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  await expect(page).toHaveTitle(/Xiwei Wang.*Software Engineer/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/XIWEI\s+WANG/);
  await expect(page.locator(".sculpture-scene")).toBeVisible();
  await expect(page.locator(".sculpture-scene")).toHaveAttribute("data-artwork", "modular-cube");
  await expect(page.locator(".sculpture-scene")).toHaveAttribute("data-renderer", /^(webgl|fallback)$/);
  await expect(page.locator("#work button.case-open")).toHaveCount(3);
  await expect(page.locator("details.experience-row")).toHaveCount(5);

  const ipmd = page.locator("details.experience-row").filter({ hasText: "IPMD, Inc." });
  if ((await ipmd.getAttribute("open")) === null) await ipmd.locator("summary").click();
  await expect(ipmd).toHaveAttribute("open", "");
  await expect(ipmd).toContainText("Software Engineering Intern");
  await expect(ipmd).toContainText("May 2026 — Aug 2026");
  await expect(ipmd).toContainText("Stable Diffusion 1.5");
  await expect(ipmd).toContainText("Docker");
  await expect(ipmd).toContainText("Azure");
  await expect(ipmd).not.toContainText("Technical Manager");
  await ipmd.locator("summary").click();
  await expect(ipmd).not.toHaveAttribute("open");

  const folobotics = page.locator("details.experience-row").filter({ hasText: "FoloBotics" });
  await expect(folobotics).toContainText("Full-Stack Developer");
  await expect(folobotics).toContainText("multithreaded");
  await expect(folobotics).toContainText("25%");
  const vision = page.locator("details.experience-row").filter({ hasText: "HIT Robotics Institute" });
  await expect(vision).toContainText("May 2025 — Aug 2025");
  await expect(vision).toContainText("600");
  const sinopec = page.locator("details.experience-row").filter({ hasText: "Sinopec Group" });
  await expect(sinopec).toContainText("Jun 2024 — Dec 2024");
  await expect(sinopec).toContainText("5,000+");
  await expect(sinopec).toContainText("80 ms");

  await expect(page.locator("#background")).toContainText("Dec 2026");
  await expect(page.locator("#background")).toContainText("Expected");
  await expect(page.locator("#experiments .project-row")).toHaveCount(4);
  for (const project of ["High-Performance Java Server", "CUDA Convolution Acceleration", "Audio Anomaly Detection", "Template / ROI Toolkit"]) {
    await expect(page.locator("#experiments")).toContainText(project);
  }
  await expect(page.locator('#contact a[href="mailto:wangxiwei2002@gmail.com"]').last()).toBeVisible();
  await expect(page.locator('#contact a[href="tel:+14378723279"]')).toBeVisible();
  await expectNoOverflow(page);
  expect(errors).toEqual([]);
});

test("the AI case study shows its loaded concept workbench without the old ring artwork", async ({ page }) => {
  await page.goto("/#work");
  const visual = page.locator(".ai-visual");
  await expect(visual.locator(".ai-workbench")).toBeVisible();
  await expect(visual.locator(".latent-art")).toHaveCount(0);
  await expect(visual).toContainText("CONCEPT UI");
  const preview = visual.locator(".ai-generated-preview img");
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expectNoOverflow(page);
});

test("case studies open accessible dialogs and restore focus when dismissed", async ({ page }) => {
  await page.goto("/#work");
  const caseStudies = page.locator("#work button.case-open");
  await expect(caseStudies).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    const trigger = caseStudies.nth(index);
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading").first()).toBeVisible();
    await expect(dialog).toContainText(["IPMD", "Sinopec", "600"][index]);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await expectNoOverflow(page);
});

test("filters the retained project archive and navigates on narrow screens", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    const menu = page.getByRole("button", { name: "Open menu", exact: true });
    const workLink = page.locator('header a[href="#work"]').first();
    await expect(workLink).toBeHidden();
    await menu.click();
    await expect(workLink).toBeVisible();
    await workLink.click();
    await expect(workLink).toBeHidden();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
  }
  const archive = page.locator("#experiments");
  await archive.getByRole("button", { name: "GPU", exact: true }).click();
  await expect(archive.locator(".project-row")).toHaveCount(1);
  await expect(archive.locator(".project-row")).toContainText("CUDA");
  await archive.getByRole("button", { name: "Systems", exact: true }).click();
  await expect(archive.locator(".project-row")).toHaveCount(2);
  await archive.getByRole("button", { name: "All", exact: true }).click();
  await expect(archive.locator(".project-row")).toHaveCount(4);
  if (isMobile) await page.setViewportSize({ width: 320, height: 700 });
  await expectNoOverflow(page);
});

test("language and theme changes persist and expose the updated Chinese résumé", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Use light theme", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page).toHaveTitle(/Xiwei Wang.*软件工程师/);
  const ipmd = page.locator("details.experience-row").filter({ hasText: "IPMD" });
  await expect(ipmd).toContainText("软件工程实习生");
  await expect(ipmd).not.toContainText("技术经理");
  const sinopec = page.locator("details.experience-row").filter({ hasText: "中国石化" });
  await expect(sinopec).toContainText("2024年6月—12月");
  await expect(sinopec).toContainText("5,000+");
  await expect(page.locator("#background")).toContainText("预计");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectNoOverflow(page);
});

test("motion can be paused and resumed without hiding the sculpture", async ({ page }) => {
  await page.goto("/");
  const scene = page.locator(".sculpture-scene");
  await expect(scene).toHaveAttribute("data-renderer", "webgl");
  await expect(scene).toHaveAttribute("data-motion", "running");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(scene).toHaveAttribute("data-motion", "paused");
  await expect(scene).toBeVisible();
  await page.getByRole("button", { name: "Resume motion", exact: true }).click();
  await expect(scene).toHaveAttribute("data-motion", "running");
});

test("pausing motion keeps expanded experience and project details readable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");

  for (const [rowSelector, contentSelector] of [
    ["details.experience-row", ".role-details"],
    ["details.project-row", ".project-description"],
  ]) {
    const row = page.locator(rowSelector).first();
    await row.locator("summary").click();
    await expect(row).toHaveAttribute("open", "");
    const details = row.locator(contentSelector);
    await expect(details).toBeVisible();
    await expect(details).toHaveCSS("opacity", "1");
  }
});

test("reduced motion starts paused and work deep links remain reachable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".sculpture-scene")).toHaveAttribute("data-motion", "paused");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/#work");
  await expect(page.locator(".sculpture-scene")).toHaveAttribute("data-motion", "paused");
  await expect(page.locator("#work")).toBeInViewport();
  await expect(page.locator("#work button.case-open").first()).toBeVisible();
  await expectNoOverflow(page);
});

test("WebGL-unavailable browsers get a readable static sculpture and functioning content", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (["webgl", "webgl2", "experimental-webgl"].includes(type)) return null;
      return getContext.call(this, type, ...args);
    };
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator(".sculpture-scene");
  await expect(scene).toBeVisible();
  await expect(scene).toHaveAttribute("data-renderer", "fallback");
  await expect(scene).toHaveAttribute("data-artwork", "modular-cube");
  await expect(scene.locator("svg")).toBeVisible();
  const cubeFaces = scene.locator("svg g[data-cube-faces]");
  await expect(cubeFaces).toHaveCount(1);
  await expect(cubeFaces.locator("polygon")).toHaveCount(3);
  await expect(scene.locator("svg ellipse")).toHaveCount(0);
  await expect(scene.locator('svg path[stroke-linejoin="round"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("#work button.case-open").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("reading progress follows scroll position and expandable page content", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const progress = page.getByRole("progressbar");
  await expect(progress).toHaveAttribute("aria-valuemin", "0");
  await expect(progress).toHaveAttribute("aria-valuemax", "100");
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await expect(progress).toHaveCSS("position", "fixed");
  await expectNoOverflow(page);

  await page.evaluate(() => {
    window.scrollTo({
      top: (document.documentElement.scrollHeight - window.innerHeight) / 2,
      behavior: "instant",
    });
  });
  await expect.poll(async () => Number(await progress.getAttribute("aria-valuenow"))).toBeGreaterThanOrEqual(40);
  await expect.poll(async () => Number(await progress.getAttribute("aria-valuenow"))).toBeLessThanOrEqual(60);

  const heightBefore = await page.evaluate(() => document.documentElement.scrollHeight);
  const experience = page.locator("details.experience-row").first();
  // Toggle without scrolling to the summary: this isolates the height observer
  // from the ordinary scroll event listener that drives the progress bar.
  await experience.evaluate((element) => { element.open = true; });
  await expect(experience).toHaveAttribute("open", "");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(heightBefore);
  await expect.poll(() => page.evaluate(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const expected = Math.round((window.scrollY / scrollableHeight) * 100);
    const actual = Number(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow"));
    return actual - expected;
  })).toBe(0);

  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
  });
  await expect(progress).toHaveAttribute("aria-valuenow", "100");
  await expectNoOverflow(page);
});

test("the résumé download serves the exact production PDF", async ({ request }) => {
  const response = await request.get("/Xiwei-Wang-Resume.pdf");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const served = await response.body();
  expect(served.subarray(0, 5).toString()).toBe("%PDF-");
  const committed = await readFile(new URL("../Xiwei-Wang-Resume.pdf", import.meta.url));
  const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
  expect(sha256(served)).toBe(sha256(committed));
});
