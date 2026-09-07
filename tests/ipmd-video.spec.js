import { expect, test } from "@playwright/test";

const videoPath = (number) => `/assets/ipmd/video${number}.mp4`;
const posterPath = (number) => `/assets/ipmd/video${number}-poster.jpg`;
// The overview is video1; the two shorter clips follow in their original order.
const videoDurations = { 1: 416.426667, 2: 66.533333, 3: 150.285714 };

async function openIpmdCase(page) {
  await page.locator(".case-0 .case-open").click();
  await expect(page.locator(".case-dialog")).toBeVisible();
  await expect(page.locator(".case-video-gallery")).toBeVisible();
  return page.locator(".case-dialog .case-video");
}

function videoButton(page, number) {
  return page
    .locator(".case-video-options")
    .getByRole("button", { name: `video${number}`, exact: true });
}

async function expectReadyAtStart(video, number) {
  await expect(video).toHaveAttribute("src", videoPath(number));
  await expect(video).toHaveAttribute("poster", posterPath(number));
  await expect
    .poll(() => video.evaluate((element) => element.readyState))
    .toBeGreaterThanOrEqual(1);
  const state = await video.evaluate((element) => ({
    source: new URL(element.currentSrc).pathname,
    duration: element.duration,
    width: element.videoWidth,
    height: element.videoHeight,
    paused: element.paused,
    time: element.currentTime,
    error: element.error?.message || null,
  }));
  expect(state.source).toBe(videoPath(number));
  expect(Number.isFinite(state.duration)).toBe(true);
  expect(state.duration).toBeGreaterThan(0);
  expect(state.duration).toBeCloseTo(videoDurations[number], 0);
  expect(state.width).toBeGreaterThan(0);
  expect(state.height).toBeGreaterThan(0);
  expect(state.paused).toBe(true);
  expect(state.time).toBe(0);
  expect(state.error).toBeNull();
}

async function playVideo(video) {
  // Muting avoids browser policy differences for programmatic test playback.
  await video.evaluate(async (element) => {
    element.muted = true;
    await element.play();
  });
  await expect
    .poll(() => video.evaluate((element) => element.currentTime))
    .toBeGreaterThan(0.25);
  expect(await video.evaluate((element) => element.paused)).toBe(false);
}

async function expectReleased(previousVideo) {
  await expect
    .poll(() => previousVideo.evaluate((element) => element.paused))
    .toBe(true);
  expect(await previousVideo.evaluate((element) => element.isConnected)).toBe(
    false,
  );
  expect(
    await previousVideo.evaluate((element) => element.getAttribute("src")),
  ).toBeNull();
  await previousVideo.dispose();
}

test("IPMD offers ordered video1, video2, video3 and loads only the initial media on opening", async ({
  page,
}) => {
  const mediaRequests = new Set();
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith("/assets/ipmd/")) mediaRequests.add(path);
  });
  await page.goto("/#work");
  await expect(page.locator(".case-video-gallery")).toHaveCount(0);
  await expect(page.locator(".case-video")).toHaveCount(0);
  expect([...mediaRequests]).toEqual([]);

  const video = await openIpmdCase(page);
  const options = page.locator(".case-video-options");
  await expect(options.getByRole("button")).toHaveText([
    "video1",
    "video2",
    "video3",
  ]);
  for (const number of [1, 2, 3]) {
    await expect(videoButton(page, number)).toHaveAttribute(
      "aria-pressed",
      number === 1 ? "true" : "false",
    );
  }
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video).not.toHaveAttribute("autoplay");
  await expectReadyAtStart(video, 1);
  expect(mediaRequests.has(videoPath(1))).toBe(true);
  expect(mediaRequests.has(posterPath(1))).toBe(true);
  for (const number of [2, 3]) {
    expect(mediaRequests.has(videoPath(number))).toBe(false);
    expect(mediaRequests.has(posterPath(number))).toBe(false);
  }
});

test("IPMD loads selections lazily, plays all three videos, and releases media on switching and closing", async ({
  page,
}) => {
  const mediaRequests = new Set();
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith("/assets/ipmd/")) mediaRequests.add(path);
  });
  await page.goto("/#work");
  const video = await openIpmdCase(page);
  await expectReadyAtStart(video, 1);
  await playVideo(video);

  for (const number of [2, 3]) {
    expect(mediaRequests.has(videoPath(number))).toBe(false);
    expect(mediaRequests.has(posterPath(number))).toBe(false);
    const previousVideo = await video.elementHandle();
    await videoButton(page, number).click();
    await expect(video).toHaveCount(1);
    await expectReleased(previousVideo);
    await expectReadyAtStart(video, number);
    await expect(videoButton(page, number)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(videoButton(page, number - 1)).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(mediaRequests.has(videoPath(number))).toBe(true);
    expect(mediaRequests.has(posterPath(number))).toBe(true);
    await playVideo(video);
  }

  const previousVideo = await video.elementHandle();
  await page.locator(".dialog-close").click();
  await expect(page.locator(".case-dialog")).toBeHidden();
  await expect(page.locator(".case-video")).toHaveCount(0);
  await expectReleased(previousVideo);

  const reopened = await openIpmdCase(page);
  await expectReadyAtStart(reopened, 1);
  await expect(videoButton(page, 1)).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator(".case-dialog")).toBeHidden();
  await expect(page.locator(".case-video-gallery")).toHaveCount(0);
});

test("Chinese IPMD keeps the three video names and usable controls at 320px", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 700 });
  const video = await openIpmdCase(page);
  await expect(page.locator(".case-video-options button")).toHaveText([
    "video1",
    "video2",
    "video3",
  ]);

  for (const number of [1, 2, 3]) {
    await videoButton(page, number).click();
    await expectReadyAtStart(video, number);
    await expect(videoButton(page, number)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const directLink = page.locator(
      `.case-video-gallery a[href="${videoPath(number)}"]`,
    );
    await expect(directLink).toBeVisible();
    await expect(directLink).toHaveAttribute("target", "_blank");
    const sizes = await video.evaluate((element) => {
      const dialog = element.closest("dialog");
      const options = dialog.querySelector(".case-video-options");
      return {
        pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
        dialogOverflow: dialog.scrollWidth - dialog.clientWidth,
        optionsOverflow: options.scrollWidth - options.clientWidth,
        videoWidth: element.getBoundingClientRect().width,
        dialogWidth: dialog.getBoundingClientRect().width,
      };
    });
    expect(sizes.pageOverflow).toBeLessThanOrEqual(1);
    expect(sizes.dialogOverflow).toBeLessThanOrEqual(1);
    expect(sizes.optionsOverflow).toBeLessThanOrEqual(1);
    expect(sizes.videoWidth).toBeLessThanOrEqual(sizes.dialogWidth);
  }

  await page.getByRole("button", { name: "关闭案例", exact: true }).click();
  await expect(page.locator(".case-video")).toHaveCount(0);
});

test("IPMD experience mounts its gallery on expansion and stops playback for dialogs or collapse", async ({
  page,
}) => {
  await page.goto("/#experience");
  const experience = page.locator('[data-experience-id="ipmd"]');
  await expect(experience.locator(".case-video")).toHaveCount(0);
  await experience.locator("summary").click();
  await expect(experience).toHaveAttribute("open", "");
  const gallery = experience.locator(".experience-videos .case-video-gallery");
  await expect(gallery).toBeVisible();
  await expect(gallery.locator(".case-video-options button")).toHaveText([
    "video1",
    "video2",
    "video3",
  ]);
  const video = gallery.locator(".case-video");
  await expectReadyAtStart(video, 1);
  await playVideo(video);

  const firstVideo = await video.elementHandle();
  await gallery.getByRole("button", { name: "video2", exact: true }).click();
  await expectReleased(firstVideo);
  await expectReadyAtStart(video, 2);
  await playVideo(video);

  await page.locator(".case-2 .case-open").click();
  await expect(page.locator(".case-dialog")).toBeVisible();
  await expect
    .poll(() => video.evaluate((element) => element.paused))
    .toBe(true);
  expect(await video.evaluate((element) => element.isConnected)).toBe(true);
  await playVideo(page.locator(".case-dialog .case-video"));
  expect(await video.evaluate((element) => element.paused)).toBe(true);
  await page.locator(".dialog-close").click();
  await expect(page.locator(".case-dialog")).toBeHidden();
  expect(await video.evaluate((element) => element.paused)).toBe(true);

  await playVideo(video);
  const secondVideo = await video.elementHandle();
  await experience.locator("summary").click();
  await expect(experience).not.toHaveAttribute("open");
  await expect(experience.locator(".case-video-gallery")).toHaveCount(0);
  await expectReleased(secondVideo);

  await experience.locator("summary").click();
  await expectReadyAtStart(experience.locator(".case-video"), 1);
});
