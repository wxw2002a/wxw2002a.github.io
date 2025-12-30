const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;
const root = document.documentElement;
const titleEl = document.querySelector("title");
const metaDescription = document.querySelector('meta[name="description"]');
const langButtons = Array.from(document.querySelectorAll(".lang-button"));
const siteData = window.SITE_DATA || {};

const getPathValue = (obj, path) => {
  if (!obj || !path) {
    return undefined;
  }
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const resolveText = (value, lang) => {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "object" && value[lang]) {
    return value[lang];
  }
  return "";
};

const updateTextNodes = (lang) => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const value = resolveText(getPathValue(siteData, key), lang);
    if (value) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const key = element.dataset.i18nHtml;
    const value = resolveText(getPathValue(siteData, key), lang);
    if (value) {
      element.innerHTML = value;
    }
  });
};

const setDocumentMeta = (lang) => {
  const title = resolveText(siteData?.meta?.title, lang);
  const description = resolveText(siteData?.meta?.description, lang);

  if (title && titleEl) {
    document.title = title;
  }

  if (description && metaDescription) {
    metaDescription.setAttribute("content", description);
  }
};

const applyLanguageLabels = (lang) => {
  document.querySelectorAll("[data-label-zh]").forEach((element) => {
    const label = lang === "en" ? element.dataset.labelEn : element.dataset.labelZh;
    if (label) {
      element.setAttribute("aria-label", label);
    }
  });

  document.querySelectorAll("[data-alt-zh]").forEach((image) => {
    const altText = lang === "en" ? image.dataset.altEn : image.dataset.altZh;
    if (altText) {
      image.setAttribute("alt", altText);
    }
  });
};

const renderHeroHighlights = (lang) => {
  const container = document.querySelector('[data-render="heroHighlights"]');
  if (!container) {
    return;
  }

  const highlights = siteData?.hero?.highlights || [];
  container.innerHTML = highlights
    .map(
      (item) => `
        <div class="metric" data-animate="reveal">
          <span class="metric-value">${item.value || ""}</span>
          <p class="metric-label">${resolveText(item.title, lang)}</p>
        </div>
      `
    )
    .join("");
};

const renderVisionParagraphs = (lang) => {
  const container = document.querySelector('[data-render="visionParagraphs"]');
  if (!container) {
    return;
  }

  const paragraphs = siteData?.vision?.paragraphs?.[lang] || [];
  container.innerHTML = paragraphs.map((text) => `<p>${text}</p>`).join("");
};

const renderVisionPillars = (lang) => {
  const container = document.querySelector('[data-render="visionPillars"]');
  if (!container) {
    return;
  }

  const pillars = siteData?.vision?.pillars || [];
  container.innerHTML = pillars
    .map(
      (pillar) => `
        <article class="pillar-card" data-animate="reveal">
          <h3>${resolveText(pillar.title, lang)}</h3>
          <p>${resolveText(pillar.body, lang)}</p>
        </article>
      `
    )
    .join("");
};

const renderTour = (lang) => {
  const container = document.querySelector('[data-render="tour"]');
  if (!container) {
    return;
  }

  const items = siteData?.tour?.items || [];
  if (items.length === 0) {
    container.innerHTML = `<div class="tour-empty">${resolveText(siteData?.tour?.empty, lang)}</div>`;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const linkText = lang === "en" ? "Tickets" : "购票";
      const link = item.link
        ? `<a href="${item.link}" target="_blank" rel="noopener">${linkText}</a>`
        : "";
      return `
        <article class="tour-item" data-animate="reveal">
          <div>
            <span class="tour-date">${resolveText(item.date, lang)}</span>
            <h3>${resolveText(item.city, lang)}</h3>
            <p>${resolveText(item.venue, lang)}</p>
          </div>
          ${link}
        </article>
      `;
    })
    .join("");
};

const getYouTubeId = (url = "") => {
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/i);
  return match ? match[1] : "";
};

const renderFeaturedVideo = (lang) => {
  const container = document.querySelector('[data-render="featuredVideo"]');
  if (!container) {
    return;
  }

  const featured = siteData?.videos?.featured;
  if (!featured) {
    container.innerHTML = "";
    return;
  }

  const videoId = getYouTubeId(featured.url);
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";

  container.innerHTML = `
    <div class="video-card video-card--featured" data-video-trigger data-video-url="${featured.url}">
      <div class="video-thumb" style="background-image: url('${thumbnail}')">
        <span class="video-play">▶</span>
      </div>
      <div class="video-info">
        <h3>${resolveText(featured.title, lang)}</h3>
        <p>${resolveText(featured.subtitle, lang)}</p>
      </div>
    </div>
  `;
};

const renderVideoList = (lang) => {
  const container = document.querySelector('[data-render="videoList"]');
  if (!container) {
    return;
  }

  const list = siteData?.videos?.list || [];
  container.innerHTML = list
    .map((video) => {
      const videoId = getYouTubeId(video.url || "");
      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
      const isReady = Boolean(video.url);
      const cardClass = isReady ? "video-card" : "video-card video-card--placeholder";
      const triggerAttr = isReady ? `data-video-trigger data-video-url="${video.url}"` : "";
      const thumbStyle = thumbnail ? `style="background-image: url('${thumbnail}')"` : "";

      return `
        <div class="${cardClass}" ${triggerAttr} data-animate="reveal">
          <div class="video-thumb" ${thumbStyle}>
            <span class="video-play">▶</span>
          </div>
          <div class="video-info">
            <h3>${resolveText(video.title, lang)}</h3>
            <p>${video.source || ""}</p>
          </div>
        </div>
      `;
    })
    .join("");
};

const renderAcademy = (lang) => {
  const container = document.querySelector('[data-render="academy"]');
  if (!container) {
    return;
  }

  const items = siteData?.academy?.items || [];
  container.innerHTML = items
    .map(
      (item) => `
        <article class="academy-card" data-animate="reveal">
          <h3>${resolveText(item.title, lang)}</h3>
          <p>${resolveText(item.body, lang)}</p>
        </article>
      `
    )
    .join("");
};

const renderChannels = (lang) => {
  const container = document.querySelector('[data-render="channels"]');
  if (!container) {
    return;
  }

  const items = siteData?.academy?.channels || [];
  container.innerHTML = items
    .map((item) => {
      const content = item.url
        ? `<a href="${item.url}" target="_blank" rel="noopener">${resolveText(item.body, lang)}</a>`
        : `<span>${resolveText(item.body, lang)}</span>`;
      return `
        <div class="channel-card" data-animate="reveal">
          <h3>${resolveText(item.title, lang)}</h3>
          ${content}
        </div>
      `;
    })
    .join("");
};

const renderPress = (lang) => {
  const container = document.querySelector('[data-render="press"]');
  if (!container) {
    return;
  }

  const quotes = siteData?.press?.quotes || [];
  container.innerHTML = quotes
    .map(
      (item) => `
        <blockquote data-animate="reveal">
          <p>${resolveText(item.quote, lang)}</p>
          <cite>${item.source || ""}</cite>
        </blockquote>
      `
    )
    .join("");
};

const renderAwards = (lang) => {
  const container = document.querySelector('[data-render="awards"]');
  if (!container) {
    return;
  }

  const awards = siteData?.press?.awards || [];
  container.innerHTML = awards
    .map(
      (item) => `
        <div class="award" data-animate="reveal">
          <span>${resolveText(item.title, lang)}</span>
        </div>
      `
    )
    .join("");
};

const renderGallery = (lang) => {
  const container = document.querySelector('[data-render="gallery"]');
  if (!container) {
    return;
  }

  const items = siteData?.gallery?.items || [];
  container.innerHTML = items
    .map((item) => {
      if (item.image) {
        return `
          <figure class="gallery-item" data-animate="reveal">
            <img src="${item.image}" alt="${resolveText(item.label, lang)}" loading="lazy" decoding="async">
            <figcaption>${resolveText(item.label, lang)}</figcaption>
          </figure>
        `;
      }
      return `
        <div class="gallery-item gallery-item--placeholder" data-animate="reveal">
          <span>${resolveText(item.label, lang)}</span>
        </div>
      `;
    })
    .join("");
};

const renderContact = (lang) => {
  const container = document.querySelector('[data-render="contact"]');
  if (!container) {
    return;
  }

  const items = siteData?.contact?.items || [];
  container.innerHTML = items
    .map(
      (item) => `
        <div class="contact-card">
          <h3>${resolveText(item.label, lang)}</h3>
          <p>${resolveText(item.value, lang)}</p>
        </div>
      `
    )
    .join("");
};

const applyStagger = () => {
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const baseDelay = Number.parseFloat(group.dataset.stagger) || 0.08;
    Array.from(group.children).forEach((child, index) => {
      if (child.nodeType !== 1) {
        return;
      }
      if (!child.hasAttribute("data-animate")) {
        child.setAttribute("data-animate", "reveal");
      }
      child.style.transitionDelay = `${index * baseDelay}s`;
    });
  });
};

const initReveal = () => {
  const revealElements = Array.from(document.querySelectorAll('[data-animate="reveal"]'));
  const showAll = () => revealElements.forEach((element) => element.classList.add("is-visible"));

  if (prefersReducedMotion || revealElements.length === 0) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
};

const initNavHighlight = () => {
  const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length === 0) {
    return;
  }

  const updateActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateActive(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
  updateActive(sections[0].id);
};

const initVideoModal = () => {
  const modal = document.querySelector("[data-video-modal]");
  const frame = modal?.querySelector("[data-video-frame]");
  const closeTriggers = modal ? Array.from(modal.querySelectorAll("[data-video-close]")) : [];

  if (!modal || !frame) {
    return;
  }

  const openVideo = (url) => {
    const videoId = getYouTubeId(url || "");
    if (!videoId) {
      return;
    }
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeVideo = () => {
    frame.src = "";
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-video-trigger]");
    if (trigger) {
      openVideo(trigger.dataset.videoUrl);
    }
  });

  closeTriggers.forEach((button) => button.addEventListener("click", closeVideo));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeVideo();
    }
  });
};

const renderAll = (lang) => {
  updateTextNodes(lang);
  renderHeroHighlights(lang);
  renderVisionParagraphs(lang);
  renderVisionPillars(lang);
  renderTour(lang);
  renderFeaturedVideo(lang);
  renderVideoList(lang);
  renderAcademy(lang);
  renderChannels(lang);
  renderPress(lang);
  renderAwards(lang);
  renderGallery(lang);
  renderContact(lang);

  applyStagger();
  initReveal();
};

const setLanguage = (lang) => {
  const safeLang = lang === "en" ? "en" : "zh";
  body.setAttribute("data-lang", safeLang);
  root.setAttribute("lang", safeLang === "en" ? "en" : "zh-CN");

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === safeLang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  setDocumentMeta(safeLang);
  applyLanguageLabels(safeLang);
  renderAll(safeLang);

  try {
    localStorage.setItem("preferredLanguage", safeLang);
  } catch (error) {
    // Ignore storage access errors.
  }
};

const initLanguageToggle = () => {
  let initialLang = "zh";

  try {
    const stored = localStorage.getItem("preferredLanguage");
    if (stored) {
      initialLang = stored;
    } else if ((navigator.language || "").toLowerCase().startsWith("zh")) {
      initialLang = "zh";
    } else {
      initialLang = "en";
    }
  } catch (error) {
    initialLang = (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  setLanguage(initialLang);

  langButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
};

const init = () => {
  body.classList.add("is-ready");
  initLanguageToggle();
  initNavHighlight();
  initVideoModal();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
