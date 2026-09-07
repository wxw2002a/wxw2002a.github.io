import { useEffect } from "react";

// Pointer/scroll work is event-driven and batched into one paint. No idle loop.
export default function usePortfolioMotion({ disabled, locale }) {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector(".hero");
    const sections = [...document.querySelectorAll(".section")];
    const cards = [...document.querySelectorAll(".case-study")];
    const magnets = [...document.querySelectorAll("[data-magnetic]")];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let disposed = false;
    const pending = new Map();
    const removers = [];
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const listen = (target, name, handler, options) => {
      target.addEventListener(name, handler, options);
      removers.push(() => target.removeEventListener(name, handler, options));
    };
    const resetCard = (card) => {
      pending.delete(card);
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--spot-x", "50%");
      card.style.setProperty("--spot-y", "50%");
      card.style.setProperty("--pointer-active", "0");
    };
    const resetMagnet = (element) => {
      pending.delete(element);
      element.style.setProperty("--magnet-x", "0px");
      element.style.setProperty("--magnet-y", "0px");
    };
    const paint = () => {
      frame = 0;
      if (disposed || disabled || document.hidden) return;
      pending.forEach(({ x, y, magnet }, element) => {
        if (magnet) {
          element.style.setProperty("--magnet-x", `${x * 7}px`);
          element.style.setProperty("--magnet-y", `${y * 5}px`);
        } else {
          element.style.setProperty("--tilt-x", `${-y * 4}deg`);
          element.style.setProperty("--tilt-y", `${x * 5}deg`);
          element.style.setProperty("--spot-x", `${(x + 1) * 50}%`);
          element.style.setProperty("--spot-y", `${(y + 1) * 50}%`);
          element.style.setProperty("--pointer-active", "1");
        }
      });
      pending.clear();
      const scroll = window.scrollY;
      hero?.style.setProperty(
        "--hero-shift",
        `${Math.min(scroll * 0.17, 85)}px`,
      );
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        section.style.setProperty(
          "--heading-shift",
          `${clamp((rect.top / window.innerHeight) * 18, -18, 18)}px`,
        );
        section.style.setProperty(
          "--section-progress",
          `${clamp((window.innerHeight * 0.7 - rect.top) / rect.height, 0, 1)}`,
        );
      });
    };
    const schedule = () => {
      if (!disabled && !document.hidden && !frame)
        frame = requestAnimationFrame(paint);
    };
    cards.forEach((card) => {
      resetCard(card);
      listen(
        card,
        "pointermove",
        (event) => {
          if (disabled || event.pointerType !== "mouse" || !finePointer.matches)
            return;
          const surface = card.querySelector(".project-visual");
          const rect = surface.getBoundingClientRect();
          pending.set(card, {
            x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
            y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
          });
          schedule();
        },
        { passive: true },
      );
      listen(card, "pointerleave", () => resetCard(card));
      listen(card, "focusout", () => resetCard(card));
    });
    magnets.forEach((element) => {
      resetMagnet(element);
      listen(
        element,
        "pointermove",
        (event) => {
          if (disabled || event.pointerType !== "mouse" || !finePointer.matches)
            return;
          const rect = element.getBoundingClientRect();
          pending.set(element, {
            magnet: true,
            x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
            y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
          });
          schedule();
        },
        { passive: true },
      );
      listen(element, "pointerleave", () => resetMagnet(element));
      listen(element, "blur", () => resetMagnet(element));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.motionVisible = String(entry.isIntersecting);
        });
      },
      { threshold: 0.02 },
    );
    document
      .querySelectorAll(".project-visual, .ticker, .contact-spark")
      .forEach((element) => observer.observe(element));
    const visibility = () => {
      root.dataset.motionPage = document.hidden ? "hidden" : "visible";
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        cards.forEach(resetCard);
        magnets.forEach(resetMagnet);
      } else schedule();
    };
    listen(document, "visibilitychange", visibility);
    listen(window, "scroll", schedule, { passive: true });
    listen(window, "resize", schedule, { passive: true });
    listen(finePointer, "change", () => {
      cards.forEach(resetCard);
      magnets.forEach(resetMagnet);
    });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    visibility();
    document.fonts.ready.then(() => {
      if (!disposed) schedule();
    });
    if (disabled) {
      hero?.style.setProperty("--hero-shift", "0px");
      sections.forEach((section) =>
        section.style.setProperty("--heading-shift", "0px"),
      );
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      removers.forEach((remove) => remove());
      cards.forEach(resetCard);
      magnets.forEach(resetMagnet);
    };
  }, [disabled, locale]);
}
