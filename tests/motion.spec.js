import { expect, test } from "@playwright/test";

const readFrame = async (scene) => Number(await scene.getAttribute("data-frame"));
const readExplosion = async (scene) => Number(await scene.getAttribute("data-explosion"));

async function expectStaticFrame(page, scene) {
  // Allow the final requested render and its diagnostic update to settle.
  await page.waitForTimeout(300);
  const frame = await readFrame(scene);
  await page.waitForTimeout(650);
  expect(await readFrame(scene), "A stopped scene must not keep rendering").toBe(frame);
}

async function openScene(page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const scene = page.locator(".sculpture-scene");
  await expect(scene).toHaveAttribute("data-renderer", "webgl");
  await expect(scene).toHaveAttribute("data-frame", /^\d+$/);
  return scene;
}

test("the sculpture renders changing frames, freezes when paused, and resumes", async ({ page }) => {
  const scene = await openScene(page);
  await expect(scene).toHaveAttribute("data-motion", "running");
  const initial = await readFrame(scene);
  await expect.poll(() => readFrame(scene)).toBeGreaterThan(initial);

  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(scene).toHaveAttribute("data-motion", "paused");
  await expectStaticFrame(page, scene);

  const frozen = await readFrame(scene);
  await page.getByRole("button", { name: "Resume motion", exact: true }).click();
  await expect(scene).toHaveAttribute("data-motion", "running");
  await expect.poll(() => readFrame(scene)).toBeGreaterThan(frozen);
});

test("cube assembly controls work both in motion and as paused static states", async ({ page }) => {
  const scene = await openScene(page);
  const explode = page.getByRole("button", { name: "Explode cube", exact: true });
  await expect(explode).toHaveAttribute("aria-pressed", "false");
  await explode.click();
  const assemble = page.getByRole("button", { name: "Assemble cube", exact: true });
  await expect(assemble).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => readExplosion(scene)).toBeGreaterThan(0.9);
  await assemble.click();
  await expect(explode).toHaveAttribute("aria-pressed", "false");
  // Assembled mode retains a subtle mechanical breathing movement.
  await expect.poll(() => readExplosion(scene)).toBeLessThan(0.3);

  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await explode.click();
  await expect(assemble).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => readExplosion(scene)).toBeGreaterThan(0.95);
  await expect(scene).toHaveAttribute("data-motion", "paused");
  await expectStaticFrame(page, scene);
  await assemble.click();
  await expect.poll(() => readExplosion(scene)).toBeLessThan(0.05);
  await expectStaticFrame(page, scene);
});

test("reduced-motion keeps the new effects static and the controls usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const scene = await openScene(page);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(scene).toHaveAttribute("data-motion", "paused");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectStaticFrame(page, scene);

  await page.getByRole("button", { name: "Explode cube", exact: true }).click();
  await expect.poll(() => readExplosion(scene)).toBeGreaterThan(0.95);
  await expectStaticFrame(page, scene);
  await page.locator("#work button.case-open").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("IPMD");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("AI reveal animation accompanies a loaded image and obeys global pause", async ({ page }) => {
  await page.goto("/#work");
  const preview = page.locator(".ai-generated-preview");
  await preview.scrollIntoViewIfNeeded();
  const image = preview.locator("img");
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  const sweep = page.locator(".ai-reveal-sweep");
  await expect(sweep).toHaveCount(1);
  await expect.poll(() => sweep.evaluate((element) => getComputedStyle(element).animationName)).not.toBe("none");
  await expect.poll(() => sweep.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("running");

  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await preview.scrollIntoViewIfNeeded();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect.poll(() => sweep.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("paused");
  await expect(image).toBeVisible();
});

test("offscreen sculpture stops rendering and restarts when it returns", async ({ page }) => {
  const scene = await openScene(page);
  await expect(scene).toHaveAttribute("data-motion", "running");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(scene).not.toBeInViewport();
  await expect(scene).toHaveAttribute("data-motion", "paused");
  await expectStaticFrame(page, scene);
  const frozen = await readFrame(scene);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(scene).toBeInViewport();
  await expect(scene).toHaveAttribute("data-motion", "running");
  await expect.poll(() => readFrame(scene)).toBeGreaterThan(frozen);
});

test("case-study pointer effects respect input type and retain keyboard access", async ({ page, isMobile }) => {
  await page.goto("/#work");
  const card = page.locator(".case-study").first();
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width * 0.7, box.y + Math.min(box.height * 0.35, 220));
  const tilt = () => card.evaluate((element) => {
    const x = parseFloat(element.style.getPropertyValue("--tilt-x")) || 0;
    const y = parseFloat(element.style.getPropertyValue("--tilt-y")) || 0;
    return Math.abs(x) + Math.abs(y);
  });
  if (isMobile) {
    await expect.poll(tilt).toBe(0);
  } else {
    await expect.poll(tilt).toBeGreaterThan(0.1);
    await expect.poll(() => card.evaluate((element) => element.style.getPropertyValue("--spot-x"))).not.toBe("");
    await expect.poll(() => card.evaluate((element) => element.style.getPropertyValue("--spot-y"))).not.toBe("");
    await page.getByRole("button", { name: "Pause motion", exact: true }).click();
    await expect.poll(tilt).toBe(0);
  }

  const trigger = card.locator("button.case-open");
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});
