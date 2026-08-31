import { expect, test } from "@playwright/test";

test("renders the complete portfolio without runtime errors", async ({ page, isMobile }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page).toHaveTitle(/Xiwei Wang/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I build products");
  await expect(page.locator(".system-map")).toBeVisible();
  await expect(page.locator(".proof-item")).toHaveCount(3);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  if (isMobile) {
    const menu = page.getByRole("button", { name: "Open menu" });
    await expect(page.locator("#primary-navigation")).toBeHidden();
    await menu.click();
    await expect(page.locator("#primary-navigation")).toBeVisible();
    await page.locator("#primary-navigation").getByRole("link", { name: "Experience" }).click();
    await expect(page.locator("#primary-navigation")).toBeHidden();
  }

  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.locator(".experience-card")).toHaveCount(5);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator(".project-card")).toHaveCount(4);
  await page.getByRole("button", { name: "GPU", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toContainText("CUDA");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(4);

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(2);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(1);
  await expect(page.locator('a[href="/Xiwei-Wang-Resume.pdf"]')).toHaveCount(3);

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("language and theme controls update the document", async ({ page }) => {
  await page.goto("/");
  const initialTheme = await page.locator("html").getAttribute("data-theme");

  await page.getByRole("button", { name: "切换至中文" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("我把产品构想");
  await expect(page).toHaveTitle(/王曦威/);

  const themeControl = page.getByRole("button", { name: /使用.*主题/ });
  await themeControl.click();
  await expect.poll(async () => page.locator("html").getAttribute("data-theme")).not.toBe(initialTheme);
});

test("résumé asset is served and reduced-motion mode remains usable", async ({ browser, request }) => {
  const response = await request.get("/Xiwei-Wang-Resume.pdf");
  expect(response.ok()).toBeTruthy();
  expect((await response.body()).byteLength).toBeGreaterThan(100000);

  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".system-map")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBeTruthy();
  await context.close();
});
