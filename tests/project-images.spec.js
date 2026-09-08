import { expect, test } from "@playwright/test";
import { githubProjects } from "../app/src/githubProjects.js";
import { projectImages } from "../app/src/projectImages.js";

const illustratedProjects = githubProjects.filter(
  (project) => projectImages[project.id]?.length,
);
const textOnlyProjects = githubProjects.filter(
  (project) => !projectImages[project.id]?.length,
);

async function openIntroduction(page, project, zh = false) {
  await page
    .locator(`#github-projects [data-project="${project.id}"]`)
    .getByRole("button", {
      name: `${zh ? "查看介绍：" : "View introduction: "}${project.title}`,
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
    project.title,
  );
  return dialog;
}

async function expectImageDecodedAtOriginalRatio(image) {
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() => image.evaluate((element) => element.naturalWidth))
    .toBeGreaterThan(0);
  await image.evaluate((element) => element.decode());
  const geometry = await image.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      complete: element.complete,
      naturalWidth: element.naturalWidth,
      naturalHeight: element.naturalHeight,
      widthAttribute: Number(element.getAttribute("width")),
      heightAttribute: Number(element.getAttribute("height")),
      renderedWidth: bounds.width,
      renderedHeight: bounds.height,
      objectFit: getComputedStyle(element).objectFit,
    };
  });
  expect(geometry.complete).toBe(true);
  expect(geometry.widthAttribute).toBe(geometry.naturalWidth);
  expect(geometry.heightAttribute).toBe(geometry.naturalHeight);
  expect(geometry.renderedWidth).toBeGreaterThan(0);
  expect(geometry.renderedHeight).toBeGreaterThan(0);
  expect(geometry.objectFit).not.toBe("cover");
  expect(
    Math.abs(
      geometry.renderedHeight -
        (geometry.renderedWidth * geometry.naturalHeight) /
          geometry.naturalWidth,
    ),
  ).toBeLessThan(2);
}

async function expectNoOverflow(page, dialog) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth - element.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  const gallery = dialog.locator(".project-image-gallery");
  expect(
    await gallery.evaluate(
      (element) => element.scrollWidth - element.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
}

test("README galleries display every manifest image locally, with accurate dimensions, captions, and GitHub provenance", async ({
  page,
}) => {
  test.setTimeout(60000);
  const errors = [];
  const externalImageRequests = [];
  const screenshotRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/assets/projects/")) {
      screenshotRequests.push(request.url());
    }
    if (
      request.resourceType() === "image" &&
      /github(?:usercontent)?\.com/.test(request.url())
    ) {
      externalImageRequests.push(request.url());
    }
  });
  await page.route(
    /https:\/\/(?:api\.github\.com|raw\.githubusercontent\.com|github\.com)\//,
    (route) => route.abort(),
  );
  await page.goto("/#projects");
  expect(illustratedProjects.length).toBeGreaterThan(0);
  await expect(page.locator(".project-image-gallery")).toHaveCount(0);
  expect(screenshotRequests).toEqual([]);

  for (const project of illustratedProjects) {
    const dialog = await openIntroduction(page, project);
    const gallery = dialog.locator(".project-image-gallery");
    const figures = gallery.locator("figure");
    const images = projectImages[project.id];
    await expect(gallery).toHaveCount(1);
    await expect(figures).toHaveCount(images.length);
    for (const [index, asset] of images.entries()) {
      const figure = figures.nth(index);
      const image = figure.locator("img");
      await expect(image).toHaveCount(1);
      await expect(image).toHaveAttribute("src", asset.src);
      expect(asset.src).toMatch(new RegExp(`^/assets/projects/${project.id}/`));
      await expect(image).toHaveAttribute("alt", asset.alt.en);
      await expect(image).toHaveAttribute("width", String(asset.width));
      await expect(image).toHaveAttribute("height", String(asset.height));
      await expect(image).toHaveAttribute("loading", "lazy");
      await expect(figure.locator("figcaption")).toContainText(
        asset.caption.en,
      );
      const provenance = figure.locator(
        `a[href^="https://github.com/wxw2002a/${project.id}/"]`,
      );
      await expect(provenance).toHaveCount(1);
      await expect(provenance).toHaveAttribute("href", asset.sourceUrl);
      await expect(provenance).toHaveAttribute("target", "_blank");
      await expect(provenance).toHaveAttribute("rel", /\bnoreferrer\b/);
      await expectImageDecodedAtOriginalRatio(image);
    }
    await expectNoOverflow(page, dialog);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  }
  expect(errors).toEqual([]);
  expect(externalImageRequests).toEqual([]);
});

test("both image and Open original links open the same full image in a safe new tab without dismissing the project", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/#projects");
  for (const project of illustratedProjects) {
    const dialog = await openIntroduction(page, project);
    const figure = dialog.locator(".project-image-gallery figure").first();
    const asset = projectImages[project.id][0];
    const links = [
      figure.locator("a").filter({ has: page.locator("img") }),
      figure.getByRole("link", { name: "Open original", exact: true }),
    ];
    for (const link of links) {
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute("href", asset.src);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
      const popupPromise = page.waitForEvent("popup");
      await link.click();
      const popup = await popupPromise;
      await popup.waitForLoadState("domcontentloaded");
      await expect(popup).toHaveURL(new URL(asset.src, page.url()).href);
      await expect
        .poll(() =>
          popup.locator("img").evaluate((image) => image.naturalWidth),
        )
        .toBeGreaterThan(0);
      expect(await popup.evaluate(() => window.opener === null)).toBe(true);
      await expect(dialog).toHaveJSProperty("open", true);
      await expect(page).toHaveURL(/#projects$/);
      await popup.close();
    }
    await page.keyboard.press("Escape");
  }
});

test("text-only introductions do not render empty galleries and the illustrated IPMD introduction retains all three videos", async ({
  page,
}) => {
  await page.goto("/#projects");
  expect(textOnlyProjects.map((project) => project.id).sort()).toEqual(
    ["Bitcoin-project", "ic-fa", "LowPassFilter_Tool"].sort(),
  );
  for (const project of textOnlyProjects) {
    const dialog = await openIntroduction(page, project);
    await expect(dialog.locator(".project-image-gallery")).toHaveCount(0);
    await expect(dialog.locator(".dialog-summary")).toHaveText(/\S/);
    await page.keyboard.press("Escape");
  }

  const art = githubProjects.find(
    (project) => project.id === "arts-generation-platform",
  );
  const dialog = await openIntroduction(page, art);
  await expect(dialog.locator(".project-image-gallery")).toHaveCount(1);
  await expect(dialog.locator(".case-video-options button")).toHaveText([
    "video1",
    "video2",
    "video3",
  ]);
  for (const number of [1, 2, 3]) {
    await dialog
      .getByRole("button", { name: `video${number}`, exact: true })
      .click();
    const video = dialog.locator("video.case-video");
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute(
      "src",
      `/assets/ipmd/video${number}.mp4`,
    );
    await expect(video).toHaveAttribute("controls", "");
    expect(await video.evaluate((element) => element.paused)).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(page.locator("video.case-video")).toHaveCount(0);
});

test("all README images remain uncropped and readable at 320px in Chinese light mode with reduced motion", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  await page.getByRole("button", { name: "使用浅色主题", exact: true }).click();
  await page.goto("/#projects");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");

  for (const project of illustratedProjects) {
    const dialog = await openIntroduction(page, project, true);
    const gallery = dialog.locator(".project-image-gallery");
    const images = gallery.locator("img");
    for (const image of await images.all()) {
      await expect(image).toHaveAttribute("alt", /[\u3400-\u9fff]/);
      await expectImageDecodedAtOriginalRatio(image);
      await expectNoOverflow(page, dialog);
    }
    await expect(
      gallery.getByRole("link", { name: "打开原图", exact: true }),
    ).toHaveCount(projectImages[project.id].length);
    for (const caption of await gallery.locator("figcaption").all()) {
      await expect(caption).toContainText(/[\u3400-\u9fff]/);
    }
    await dialog.locator(".dialog-close").click();
    await expect(dialog).toBeHidden();
  }
});
