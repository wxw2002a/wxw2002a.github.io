import { expect, test } from "@playwright/test";

const repositories = [
  "arts-generation-platform",
  "Bitcoin-project",
  "cineflow",
  "ic-fa",
  "second-hand-hub",
  "LowPassFilter_Tool",
];

async function expectProjectSet(section, expected) {
  const cards = section.locator("article.github-project-card");
  await expect(cards).toHaveCount(expected.length);
  expect(
    await cards.evaluateAll((items) =>
      items.map((item) => item.dataset.project).sort(),
    ),
  ).toEqual([...expected].sort());
  const count = section.locator(".github-project-count");
  await expect(count).toHaveAttribute("aria-live", "polite");
  await expect(count).toContainText(new RegExp(`\\b0?${expected.length}\\b`));
}

async function expectNoOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
}

test("GitHub Projects links all six pinned repositories and attributes the art platform to IPMD", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#projects");
  const projects = page.locator("#projects");
  await expect(projects).toBeInViewport();
  await expectProjectSet(projects, repositories);

  for (const repository of repositories) {
    const card = projects.locator(`[data-project="${repository}"]`);
    await expect(card.getByRole("heading")).toHaveText(/\S/);
    const source = card.locator(
      `a[href="https://github.com/wxw2002a/${repository}"]`,
    );
    await expect(source).toHaveCount(1);
    await expect(source).toHaveAttribute("target", "_blank");
    await expect(source).toHaveAttribute("rel", /\bnoreferrer\b/);
  }

  const art = projects.locator('[data-project="arts-generation-platform"]');
  await expect(art).toContainText("IPMD");
  await expect(
    art.getByRole("button", { name: "View IPMD case", exact: true }),
  ).toBeVisible();
  await expectNoOverflow(page);
  expect(errors).toEqual([]);
});

test("GitHub category filters update their live count without losing the original engineering archive", async ({
  page,
}) => {
  await page.goto("/#projects");
  const projects = page.locator("#projects");
  for (const [label, expected] of [
    ["Products", ["arts-generation-platform", "cineflow", "second-hand-hub"]],
    ["Systems & tools", ["Bitcoin-project", "ic-fa", "LowPassFilter_Tool"]],
    ["IPMD", ["arts-generation-platform"]],
    ["All", repositories],
  ]) {
    const filter = projects
      .locator(".github-project-filters")
      .getByRole("button", { name: label, exact: true });
    await filter.click();
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expectProjectSet(projects, expected);
  }

  const archive = page.locator("#experiments");
  await expect(archive.locator(".project-row")).toHaveCount(4);
  for (const title of [
    "High-Performance Java Server",
    "CUDA Convolution Acceleration",
    "Audio Anomaly Detection",
    "Template / ROI Toolkit",
  ]) {
    await expect(archive).toContainText(title);
  }
  await expect(page.locator("#work button.case-open")).toHaveCount(3);
  await expectNoOverflow(page);
});

test("Projects navigation and deep links work in Chinese and both themes at 320px", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const projectsLink = page.locator('header a[href="#projects"]');
  await expect(projectsLink).toHaveText("Projects");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
  }
  await projectsLink.click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
  if (isMobile) await expect(projectsLink).toBeHidden();

  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/#projects");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(projectsLink).toHaveText("项目");
  const projects = page.locator("#projects");
  await expect(projects).toBeInViewport();
  for (const label of ["全部", "产品应用", "系统与工具", "IPMD"]) {
    await expect(
      projects
        .locator(".github-project-filters")
        .getByRole("button", { name: label, exact: true }),
    ).toBeVisible();
  }
  await expect(projects.locator(".github-project-card")).toHaveCount(6);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectNoOverflow(page);

  await page.getByRole("button", { name: "使用浅色主题", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await projects.scrollIntoViewIfNeeded();
  await expectNoOverflow(page);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(projects).toBeInViewport();
  await expectNoOverflow(page);
});

test("the IPMD project opens the existing video1 case and restores focus after dismissal", async ({
  page,
}) => {
  await page.goto("/#projects");
  const trigger = page
    .locator('#projects [data-project="arts-generation-platform"]')
    .getByRole("button", { name: "View IPMD case", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("IPMD");
  await expect(dialog.locator(".case-video-options button")).toHaveText([
    "video1",
    "video2",
    "video3",
  ]);
  await expect(
    dialog.getByRole("button", { name: "video1", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const video = dialog.locator("video.case-video");
  await expect(video).toHaveAttribute("src", "/assets/ipmd/video1.mp4");
  await expect(video).toHaveAttribute(
    "poster",
    "/assets/ipmd/video1-poster.jpg",
  );
  await expect(video).toHaveAttribute("controls", "");
  await expect
    .poll(() => video.evaluate((element) => element.readyState))
    .toBeGreaterThanOrEqual(1);
  // This is the Creating Without Words overview, not either shorter clip.
  expect(await video.evaluate((element) => element.duration)).toBeCloseTo(
    416.426667,
    0,
  );
  expect(await video.evaluate((element) => element.paused)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("video.case-video")).toHaveCount(0);
  await expectNoOverflow(page);
});
