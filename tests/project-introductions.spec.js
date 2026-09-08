import { expect, test } from "@playwright/test";

const projects = [
  {
    id: "arts-generation-platform",
    title: "Arts Generation Platform",
    tech: "React",
    source: "readme",
  },
  {
    id: "Bitcoin-project",
    title: "Bitcoin Project",
    tech: "Java",
    source: "code",
  },
  { id: "cineflow", title: "CineFlow", tech: "PyTorch", source: "readme" },
  {
    id: "ic-fa",
    title: "ic-fa / PenPad",
    tech: "Pointer Events",
    source: "readme",
  },
  {
    id: "second-hand-hub",
    title: "Second Hand Hub",
    tech: "Socket.IO",
    source: "readme",
  },
  {
    id: "LowPassFilter_Tool",
    title: "Low-Pass Filter Tool",
    tech: "NumPy",
    source: "readme",
  },
];

const cardFor = (page, project) =>
  page.locator(`#github-projects [data-project="${project.id}"]`);

function triggerFor(page, project, zh = false) {
  return cardFor(page, project).getByRole("button", {
    name: `${zh ? "查看介绍：" : "View introduction: "}${project.title}`,
    exact: true,
  });
}

async function expectNoOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible()) {
    expect(
      await dialog.evaluate(
        (element) => element.scrollWidth - element.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
  }
}

test("all six GitHub cards open substantive introductions in the shared work dialog while retaining source links", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#projects");

  for (const project of projects) {
    const card = cardFor(page, project);
    const trigger = triggerFor(page, project);
    await expect(trigger).toHaveText("View introduction");
    const source = card.locator(
      `a[href="https://github.com/wxw2002a/${project.id}"]`,
    );
    await expect(source).toHaveCount(1);
    await expect(source).toHaveAttribute("target", "_blank");
    await expect(source).toHaveAttribute("rel", /\bnoreferrer\b/);
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveClass(/\bcase-dialog\b/);
    await expect(dialog).toHaveJSProperty("open", true);
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
      project.title,
    );
    expect(
      (await dialog.locator(".dialog-summary").innerText()).trim().length,
    ).toBeGreaterThan(80);
    expect(
      await dialog.getByRole("heading", { level: 3 }).count(),
    ).toBeGreaterThanOrEqual(2);
    expect(await dialog.locator("ul li").count()).toBeGreaterThanOrEqual(3);
    await expect(dialog.locator(".tags")).toContainText(project.tech);
    await expect(
      dialog.locator(`a[href="https://github.com/wxw2002a/${project.id}"]`),
    ).toHaveCount(1);
    await expect(page).toHaveURL(/\/#projects$/);
    await expectNoOverflow(page);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test("project introductions retain real GitHub references and use neutral Bitcoin source labels", async ({
  page,
}) => {
  await page.goto("/#projects");
  for (const project of projects) {
    await triggerFor(page, project).click();
    const dialog = page.getByRole("dialog");
    const source = dialog.locator(".project-intro-source");
    await expect(source).toHaveAttribute("data-source-kind", project.source);
    await expect(source).toContainText("GitHub");
    const reference = source.locator("a");
    expect(await reference.count()).toBeGreaterThanOrEqual(1);
    await expect(reference.first()).toHaveAttribute(
      "href",
      new RegExp(`^https://github\\.com/wxw2002a/${project.id}/`),
    );
    await expect(reference.first()).toHaveAttribute("target", "_blank");
    if (project.source === "readme") {
      await expect(source).toContainText("README");
      await expect(reference.first()).toHaveAttribute("href", /README/i);
    } else {
      await expect(source.locator("span")).toHaveText("Project overview");
      await expect(reference.first()).toHaveText("GitHub source");
      await expect(reference.first()).toHaveAttribute(
        "href",
        "https://github.com/wxw2002a/Bitcoin-project/blob/main/Client.java",
      );
      await expect(dialog).not.toContainText(
        /No README|written from repository code|暂无\s*README|根据代码整理|根据源码整理/i,
      );
      await expect(dialog).toContainText(/prototype|scaffold/i);
    }
    await page.keyboard.press("Escape");
  }
});

test("the IPMD introduction keeps all three correctly named videos and releases the player when closed", async ({
  page,
}) => {
  await page.goto("/#projects");
  const project = projects[0];
  const trigger = triggerFor(page, project);
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("IPMD");
  await expect(dialog.locator(".case-video-options button")).toHaveText([
    "video1",
    "video2",
    "video3",
  ]);
  for (let number = 1; number <= 3; number += 1) {
    const option = dialog.getByRole("button", {
      name: `video${number}`,
      exact: true,
    });
    await option.click();
    await expect(option).toHaveAttribute("aria-pressed", "true");
    const player = dialog.locator("video.case-video");
    await expect(player).toHaveCount(1);
    await expect(player).toHaveAttribute(
      "src",
      `/assets/ipmd/video${number}.mp4`,
    );
    await expect(player).toHaveAttribute("controls", "");
    expect(await player.evaluate((element) => element.paused)).toBe(true);
  }
  await dialog.locator(".dialog-close").click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("video.case-video")).toHaveCount(0);

  // The retained work-case shortcut remains a separate action, not a source link.
  await cardFor(page, project)
    .getByRole("button", { name: "View IPMD case", exact: true })
    .click();
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "video1", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.locator("video.case-video")).toHaveAttribute(
    "src",
    "/assets/ipmd/video1.mp4",
  );
  await page.keyboard.press("Escape");
});

test("card surfaces and keyboard controls open introductions and every dismissal restores focus and page scrolling", async ({
  page,
}) => {
  await page.goto("/#projects");
  const project = projects[2];
  const card = cardFor(page, project);
  const trigger = triggerFor(page, project);
  const dialog = page.getByRole("dialog");

  await card.scrollIntoViewIfNeeded();
  const bounds = await card.boundingBox();
  await page.mouse.click(bounds.x + 16, bounds.y + 16);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
    project.title,
  );
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  await trigger.press("Enter");
  await expect(dialog).toBeVisible();
  await dialog.locator(".dialog-close").click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.press("Space");
  await expect(dialog).toBeVisible();
  // A real click outside the native dialog exercises backdrop dismissal.
  await page.mouse.click(2, 2);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  // Reopen the same project immediately, including before the native dialog's
  // deferred close event could arrive. State must not swallow the new request.
  await trigger.press("Enter");
  for (let iteration = 0; iteration < 5; iteration += 1) {
    await expect(dialog).toBeVisible();
    await dialog.locator(".dialog-close").click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.press("Space");
    await expect(dialog).toBeVisible();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  // The stretched introduction hit area must leave real external links usable.
  // Fulfill popup navigation locally so this check never depends on GitHub uptime.
  for (const [targetProject, url] of [
    [project, "https://github.com/wxw2002a/cineflow"],
    [projects[3], "https://wxw2002a.github.io/ic-fa/"],
  ]) {
    await page.context().route(url, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<title>Link destination</title>",
      }),
    );
    const popupPromise = page.waitForEvent("popup");
    await cardFor(page, targetProject).locator(`a[href="${url}"]`).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    await expect(popup).toHaveURL(url);
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/#projects$/);
    await popup.close();
  }
  await expectNoOverflow(page);
});

test("Chinese introductions remain readable at 320px in light mode and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.getByRole("button", { name: "切换至中文", exact: true }).click();
  await page.getByRole("button", { name: "使用浅色主题", exact: true }).click();
  await page.goto("/#projects");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");

  for (const project of projects) {
    const trigger = triggerFor(page, project, true);
    await expect(trigger).toHaveText("查看介绍");
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
      project.title,
    );
    await expect(dialog.locator(".dialog-summary")).toContainText(
      /[\u3400-\u9fff]/,
    );
    await expect(dialog.locator(".project-intro-source")).toContainText(
      /[\u3400-\u9fff]/,
    );
    if (project.source === "code") {
      const source = dialog.locator(".project-intro-source");
      await expect(source.locator("span")).toHaveText("项目介绍");
      await expect(source.locator("a")).toHaveText("GitHub 源码");
      await expect(source.locator("a")).toHaveAttribute(
        "href",
        "https://github.com/wxw2002a/Bitcoin-project/blob/main/Client.java",
      );
      await expect(dialog).not.toContainText(
        /No README|written from repository code|暂无\s*README|根据代码整理|根据源码整理/i,
      );
    }
    await expect(dialog.locator(".tags")).toContainText(project.tech);
    await expectNoOverflow(page);
    await dialog.locator(".dialog-close").click();
    await expect(trigger).toBeFocused();
  }
});

test("introductions load from the site itself without a runtime GitHub or backend API dependency", async ({
  page,
}) => {
  const externalApiRequests = [];
  const dataApiRequests = [];
  page.on("request", (request) => {
    if (["fetch", "xhr"].includes(request.resourceType())) {
      dataApiRequests.push(request.url());
    }
  });
  await page.route(
    /https:\/\/(?:api\.github\.com|raw\.githubusercontent\.com|github\.com)\//,
    async (route) => {
      externalApiRequests.push(route.request().url());
      await route.abort();
    },
  );
  await page.goto("/#projects");
  for (const project of projects) {
    await triggerFor(page, project).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
      project.title,
    );
    await expect(dialog.locator(".dialog-summary")).toHaveText(/\S/);
    await page.keyboard.press("Escape");
  }
  expect(externalApiRequests).toEqual([]);
  expect(dataApiRequests).toEqual([]);
});
