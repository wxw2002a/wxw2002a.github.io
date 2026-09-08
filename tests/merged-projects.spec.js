import { expect, test } from "@playwright/test";

async function expectNoOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
}

async function expectSectionNumbers(page) {
  const numberedSections = page.locator(
    "main > section > .section-top > .eyebrow",
  );
  await expect(numberedSections).toHaveCount(5);
  expect(
    await numberedSections.evaluateAll((items) =>
      items.map((item) => item.textContent.trim().match(/^\d{2}/)?.[0]),
    ),
  ).toEqual(["01", "02", "03", "04", "05"]);
  await expect(page.locator("#projects > .section-top > .eyebrow")).toHaveText(
    /^03\s*\//,
  );
  await expect(
    page.locator("#background > .section-top > .eyebrow"),
  ).toHaveText(/^04\s*\//);
  await expect(page.locator("#contact > .section-top > .eyebrow")).toHaveText(
    /^05\s*\//,
  );
}

test("one numbered Projects section groups GitHub and University Projects without discarding either collection", async ({
  page,
}) => {
  await page.goto("/#projects");
  const projects = page.locator("#projects");
  await expect(page.locator("main > #projects")).toHaveCount(1);
  await expect(page.locator("main > #experiments")).toHaveCount(0);
  await expect(projects.locator("#github-projects")).toHaveCount(1);
  await expect(projects.locator("#experiments")).toHaveCount(1);
  await expect(
    projects.getByRole("heading", { name: "GitHub Projects", exact: true }),
  ).toBeVisible();
  await expect(
    projects.getByRole("heading", { name: "University Projects", exact: true }),
  ).toBeVisible();
  await expect(projects.locator(".github-project-card")).toHaveCount(6);
  await expect(projects.locator("#experiments .project-row")).toHaveCount(4);
  await expect(page.getByText("OFF THE CLOCK", { exact: true })).toHaveCount(0);
  await expectSectionNumbers(page);
  await expectNoOverflow(page);
});

test("the two project category filters remain independent inside their shared section", async ({
  page,
}) => {
  await page.goto("/#projects");
  const github = page.locator("#github-projects");
  const university = page.locator("#experiments");
  const githubFilters = github.locator(".github-project-filters");
  const universityFilters = university.locator(".filters");

  await githubFilters
    .getByRole("button", { name: "IPMD", exact: true })
    .click();
  await expect(github.locator(".github-project-card")).toHaveCount(1);
  await expect(university.locator(".project-row")).toHaveCount(4);
  await universityFilters
    .getByRole("button", { name: "GPU", exact: true })
    .click();
  await expect(university.locator(".project-row")).toHaveCount(1);
  await expect(university.locator(".project-row")).toContainText("CUDA");
  await expect(github.locator(".github-project-card")).toHaveCount(1);
  await expect(github.locator(".github-project-card")).toHaveAttribute(
    "data-project",
    "arts-generation-platform",
  );
  await expect(
    githubFilters.getByRole("button", { name: "IPMD", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  const row = university.locator("details.project-row");
  await row.locator("summary").click();
  await expect(row).toHaveAttribute("open", "");
  await expect(row.locator(".project-description")).toBeVisible();
  await expect(row.locator(".project-description")).toContainText(/\S/);
  await githubFilters.getByRole("button", { name: "All", exact: true }).click();
  await expect(github.locator(".github-project-card")).toHaveCount(6);
  await expect(university.locator(".project-row")).toHaveCount(1);
  await expect(
    universityFilters.getByRole("button", { name: "GPU", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await universityFilters
    .getByRole("button", { name: "All", exact: true })
    .click();
  await expect(university.locator(".project-row")).toHaveCount(4);
  await expect(github.locator(".github-project-card")).toHaveCount(6);
  await expectNoOverflow(page);
});

test("the former experiments deep link reaches University Projects in both languages and at 320px", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/#experiments");
  const university = page.locator("#projects #experiments");
  await expect(university).toBeInViewport();
  const heading = university.getByRole("heading", {
    name: "University Projects",
    exact: true,
  });
  await expect(heading).toBeInViewport();
  await expect(university.locator(".project-row")).toHaveCount(4);
  await expectNoOverflow(page);

  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  await page.reload();
  await expect(page).toHaveURL(/#experiments$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(
    university.getByRole("heading", { name: "大学项目", exact: true }),
  ).toBeInViewport();
  await expect(university.locator(".project-row")).toHaveCount(4);
  await expect(page.getByText("自主探索", { exact: true })).toHaveCount(0);
  await expectSectionNumbers(page);
  await expectNoOverflow(page);
  await page.getByRole("button", { name: "使用浅色主题", exact: true }).click();
  // Clicking the header theme control scrolls it into view. Reload the retained
  // deep link to check its destination, independently of that click scrolling.
  await page.reload();
  await expect(page).toHaveURL(/#experiments$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(university).toBeInViewport();
  await expectNoOverflow(page);
  expect(errors).toEqual([]);
});
