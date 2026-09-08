import { expect, test } from "@playwright/test";

const philosophy = "“Good engineering is problem-solving with constraints.”";
const description =
  "That idea has shaped how I learn and build: stay curious, break problems down quickly, and pick up whatever tools the job demands.";

async function expectEditorialLayout(page) {
  const layout = await page.locator(".hero-editorial").evaluate((hero) => {
    const bounds = hero.getBoundingClientRect();
    const copy = hero.querySelector(".hero-copy").getBoundingClientRect();
    const visual = hero.querySelector(".hero-visual").getBoundingClientRect();
    const intersectionWidth = Math.max(
      0,
      Math.min(copy.right, visual.right) - Math.max(copy.left, visual.left),
    );
    const intersectionHeight = Math.max(
      0,
      Math.min(copy.bottom, visual.bottom) - Math.max(copy.top, visual.top),
    );
    const content = [
      ".hero-philosophy",
      ".hero-description",
      ".hero-actions",
      ".cube-control",
      ".hero-motion",
    ].map((selector) => {
      const element = hero.querySelector(selector);
      const rect = element.getBoundingClientRect();
      return {
        selector,
        width: rect.width,
        height: rect.height,
        overflow: element.scrollWidth - element.clientWidth,
        outsideHero: Math.max(
          bounds.left - rect.left,
          rect.right - bounds.right,
          bounds.top - rect.top,
          rect.bottom - bounds.bottom,
        ),
      };
    });
    return {
      intersection: intersectionWidth * intersectionHeight,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      content,
    };
  });
  expect(
    layout.intersection,
    "Hero copy and sculpture must not overlap",
  ).toBeLessThanOrEqual(1);
  expect(layout.pageOverflow).toBeLessThanOrEqual(1);
  for (const content of layout.content) {
    expect(
      content.width,
      `${content.selector} has a visible width`,
    ).toBeGreaterThan(0);
    expect(
      content.height,
      `${content.selector} has a visible height`,
    ).toBeGreaterThan(0);
    expect(
      content.overflow,
      `${content.selector} must not truncate its content`,
    ).toBeLessThanOrEqual(1);
    expect(
      content.outsideHero,
      `${content.selector} must remain inside the hero`,
    ).toBeLessThanOrEqual(1);
  }
}

test("the editorial hero presents the exact engineering philosophy and working destination links", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator(".hero-editorial");
  await expect(
    hero.getByRole("heading", { level: 1, name: "Xiwei Wang", exact: true }),
  ).toBeVisible();
  await expect(hero.locator(".hero-philosophy")).toHaveText(philosophy);
  await expect(hero.locator(".hero-description")).toHaveText(description);

  const resume = hero.getByRole("link", { name: "Résumé", exact: true });
  await expect(resume).toHaveAttribute(
    "href",
    /Xiwei-Wang-Resume\.pdf(?:\?.*)?$/,
  );
  await expect(resume).toHaveAttribute("target", "_blank");
  await expect(resume).toHaveAttribute("rel", /\bnoreferrer\b/);
  const response = await page.request.get(await resume.getAttribute("href"));
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");

  await hero
    .getByRole("link", { name: "Explore my work", exact: true })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
  await hero.locator('a[href="#projects"]').click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
  await expect(page.locator("#projects .github-project-card")).toHaveCount(6);
});

test("hero copy and interactive study remain separate and unclipped at standard and narrow widths", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expectEditorialLayout(page);

  if (!isMobile) {
    await page.setViewportSize({ width: 390, height: 844 });
    await expectEditorialLayout(page);
  }
  await page.setViewportSize({ width: 320, height: 700 });
  await expectEditorialLayout(page);
  for (const selector of [
    ".hero-philosophy",
    ".hero-description",
    ".cube-control",
    ".hero-motion",
  ]) {
    const content = page.locator(selector);
    await content.scrollIntoViewIfNeeded();
    await expect(content).toBeVisible();
    await expect(content).toBeInViewport();
  }
});

test("Chinese and light-theme hero preserve readable reduced-motion content and static cube controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const quote = page.locator(".hero-philosophy");
  await expect(quote).toHaveText(philosophy);
  await expect(quote).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Use light theme", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(quote).toBeVisible();
  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  await expect(quote).toHaveText("“好的工程，是在约束条件下解决问题。”");
  await expect(page.locator(".hero-description")).toHaveText(
    "这句话塑造了我的学习与构建方式：保持好奇，快速拆解问题，并掌握任务所需的任何工具。",
  );
  await page.setViewportSize({ width: 320, height: 700 });
  await page.evaluate(() => document.fonts.ready);
  await expectEditorialLayout(page);

  const scene = page.locator(".sculpture-scene");
  await expect(scene).toHaveAttribute("data-renderer", "webgl");
  await expect(scene).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "拆解方块", exact: true }).click();
  await expect
    .poll(async () => Number(await scene.getAttribute("data-explosion")))
    .toBe(1);
  await expect(
    page.getByRole("button", { name: "组装方块", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "组装方块", exact: true }).click();
  await expect
    .poll(async () => Number(await scene.getAttribute("data-explosion")))
    .toBe(0);
  await expect(scene).toHaveAttribute("data-motion", "paused");

  await expect(page.locator("#work .case-open")).toHaveCount(3);
  await page.locator("#work .case-open").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("IPMD");
  await expect(dialog.locator("video")).toHaveAttribute(
    "src",
    "/assets/ipmd/video1.mp4",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("#experiments .project-row")).toHaveCount(4);
});
