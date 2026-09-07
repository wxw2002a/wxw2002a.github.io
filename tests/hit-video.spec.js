import { expect, test } from "@playwright/test";

const videoPath = "/assets/hit-detection-demo.mp4";
const posterPath = "/assets/hit-detection-poster.jpg";

async function openHitCase(page) {
  await page.locator(".case-2 .case-open").click();
  await expect(page.locator(".case-dialog")).toBeVisible();
  return page.locator(".case-dialog .case-video");
}

async function expectVideoFits(page, video) {
  await expect(video).toBeVisible();
  const sizes = await video.evaluate((element) => {
    const dialog = element.closest("dialog");
    return {
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      dialogOverflow: dialog.scrollWidth - dialog.clientWidth,
      videoWidth: element.getBoundingClientRect().width,
      dialogWidth: dialog.getBoundingClientRect().width,
    };
  });
  expect(sizes.pageOverflow).toBeLessThanOrEqual(1);
  expect(sizes.dialogOverflow).toBeLessThanOrEqual(1);
  expect(sizes.videoWidth).toBeLessThanOrEqual(sizes.dialogWidth);
}

test("HIT media loads only inside its case, with playable metadata and no autoplay", async ({
  page,
}) => {
  const mediaRequests = [];
  page.on("request", (request) => {
    if ([videoPath, posterPath].includes(new URL(request.url()).pathname)) {
      mediaRequests.push(request.url());
    }
  });
  await page.goto("/#work");
  await expect(page.locator(".case-video")).toHaveCount(0);

  for (const index of [0, 1]) {
    await page.locator(`.case-${index} .case-open`).click();
    await expect(page.locator(".case-dialog")).toBeVisible();
    await expect(
      page.locator(`.case-dialog .case-video[src="${videoPath}"]`),
    ).toHaveCount(0);
    await page.locator(".dialog-close").click();
    await expect(page.locator(".case-dialog")).toBeHidden();
  }
  expect(
    mediaRequests,
    "Other case studies must not fetch the HIT video or poster",
  ).toEqual([]);

  const video = await openHitCase(page);
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video).toHaveAttribute("poster", posterPath);
  await expect(video).not.toHaveAttribute("autoplay");
  await expect(page.locator(".case-dialog")).toContainText(
    "HIT · Detection demo",
  );
  await expect(
    page.locator(`.case-dialog a[href="${videoPath}"]`),
  ).toBeVisible();
  await expect
    .poll(() => video.evaluate((element) => element.readyState))
    .toBeGreaterThanOrEqual(1);
  const metadata = await video.evaluate((element) => ({
    source: new URL(element.currentSrc).pathname,
    duration: element.duration,
    width: element.videoWidth,
    height: element.videoHeight,
    paused: element.paused,
    currentTime: element.currentTime,
    error: element.error?.message || null,
  }));
  expect(metadata.source).toBe(videoPath);
  expect(Number.isFinite(metadata.duration)).toBe(true);
  expect(metadata.duration).toBeGreaterThan(0);
  expect(metadata.width).toBeGreaterThan(0);
  expect(metadata.height).toBeGreaterThan(0);
  expect(metadata.paused).toBe(true);
  expect(metadata.currentTime).toBe(0);
  expect(metadata.error).toBeNull();
  expect(mediaRequests.some((url) => new URL(url).pathname === videoPath)).toBe(
    true,
  );
  await expectVideoFits(page, video);
});

test("HIT video plays, stops when dismissed, and reopens at the beginning", async ({
  page,
}) => {
  await page.goto("/#work");
  const video = await openHitCase(page);
  await expect
    .poll(() => video.evaluate((element) => element.readyState))
    .toBeGreaterThanOrEqual(1);
  // Muting makes this deterministic in browsers that gate audible programmatic playback.
  await video.evaluate(async (element) => {
    element.muted = true;
    await element.play();
  });
  await expect
    .poll(() => video.evaluate((element) => element.currentTime))
    .toBeGreaterThan(0.25);
  await expect
    .poll(() => video.evaluate((element) => element.paused))
    .toBe(false);
  const previousVideo = await video.elementHandle();

  await page.locator(".dialog-close").click();
  await expect(page.locator(".case-dialog")).toBeHidden();
  await expect(page.locator(".case-video")).toHaveCount(0);
  await expect
    .poll(() => previousVideo.evaluate((element) => element.paused))
    .toBe(true);
  expect(await previousVideo.evaluate((element) => element.isConnected)).toBe(
    false,
  );

  const reopened = await openHitCase(page);
  await expect
    .poll(() => reopened.evaluate((element) => element.readyState))
    .toBeGreaterThanOrEqual(1);
  expect(await reopened.evaluate((element) => element.currentTime)).toBe(0);
  expect(await reopened.evaluate((element) => element.paused)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.locator(".case-dialog")).toBeHidden();
  await expect(page.locator(".case-video")).toHaveCount(0);
  await previousVideo.dispose();
});

test("Chinese HIT video remains usable on narrow screens with a direct-video fallback", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  if (isMobile) await page.setViewportSize({ width: 320, height: 700 });
  const video = await openHitCase(page);
  await expect(page.locator(".case-dialog")).toContainText("HIT · 检测演示");
  const directLink = page.locator(`.case-dialog a[href="${videoPath}"]`);
  await expect(directLink).toBeVisible();
  await expect(directLink).toHaveAttribute("target", "_blank");
  await expectVideoFits(page, video);
  await page.getByRole("button", { name: "关闭案例", exact: true }).click();
  await expect(page.locator(".case-video")).toHaveCount(0);
});
