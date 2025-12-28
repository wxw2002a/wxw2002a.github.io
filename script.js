const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const root = document.documentElement;
const titleEl = document.querySelector("title");
const metaDescription = document.querySelector('meta[name="description"]');
const langButtons = Array.from(document.querySelectorAll(".lang-button"));

const setLanguage = (lang) => {
  const safeLang = lang === "en" ? "en" : "zh";
  body.setAttribute("data-lang", safeLang);
  root.setAttribute("lang", safeLang === "en" ? "en" : "zh-CN");

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === safeLang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (titleEl?.dataset) {
    document.title = safeLang === "en" ? titleEl.dataset.en : titleEl.dataset.zh;
  }

  if (metaDescription?.dataset) {
    const description = safeLang === "en" ? metaDescription.dataset.en : metaDescription.dataset.zh;
    if (description) {
      metaDescription.setAttribute("content", description);
    }
  }

  document.querySelectorAll("[data-label-zh]").forEach((element) => {
    const label = safeLang === "en" ? element.dataset.labelEn : element.dataset.labelZh;
    if (label) {
      element.setAttribute("aria-label", label);
    }
  });

  document.querySelectorAll("[data-alt-zh]").forEach((image) => {
    const altText = safeLang === "en" ? image.dataset.altEn : image.dataset.altZh;
    if (altText) {
      image.setAttribute("alt", altText);
    }
  });

  try {
    localStorage.setItem("preferredLanguage", safeLang);
  } catch (error) {
    // Ignore storage access errors.
  }
};

const setLanguageWithTransition = (lang) => {
  setLanguage(lang);
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
    button.addEventListener("click", () => setLanguageWithTransition(button.dataset.lang));
  });
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
  const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
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

const initParallax = () => {
  if (prefersReducedMotion || !window.matchMedia("(hover: hover)").matches) {
    return;
  }

  const hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  const state = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    rafId: null,
    scrollRaf: null,
  };

  const animate = () => {
    const dx = state.targetX - state.currentX;
    const dy = state.targetY - state.currentY;
    state.currentX += dx * 0.08;
    state.currentY += dy * 0.08;

    hero.style.setProperty("--parallax-x", state.currentX.toFixed(2));
    hero.style.setProperty("--parallax-y", state.currentY.toFixed(2));

    if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      state.rafId = requestAnimationFrame(animate);
    } else {
      state.rafId = null;
    }
  };

  const handlePointerMove = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    state.targetX = x * 18;
    state.targetY = y * 18;

    if (!state.rafId) {
      state.rafId = requestAnimationFrame(animate);
    }
  };

  const handlePointerLeave = () => {
    state.targetX = 0;
    state.targetY = 0;
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(animate);
    }
  };

  const updateScroll = () => {
    state.scrollRaf = null;
    const shift = Math.min(window.scrollY, 500) * 0.08;
    hero.style.setProperty("--scroll-shift", `${shift}px`);
  };

  const handleScroll = () => {
    if (state.scrollRaf) {
      return;
    }
    state.scrollRaf = requestAnimationFrame(updateScroll);
  };

  hero.addEventListener("pointermove", handlePointerMove);
  hero.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("scroll", handleScroll, { passive: true });

  updateScroll();
};

const initStageCanvas = () => {
  const canvas = document.getElementById("stage-canvas");
  if (!canvas) {
    return;
  }

  if (prefersReducedMotion) {
    return;
  }

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });

  if (!gl) {
    return;
  }

  const vertexSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentPrecision = (() => {
    const highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    return highp && highp.precision > 0 ? "highp" : "mediump";
  })();

  const fragmentSource = `
    precision ${fragmentPrecision} float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uIntensity;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.03;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= uResolution.x / uResolution.y;

      vec2 pointer = uPointer * 2.0 - 1.0;
      pointer.x *= uResolution.x / uResolution.y;

      float t = uTime * 0.12;
      vec2 warp = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t));
      p += warp * 0.35;

      float ribbon = sin((p.x + p.y) * 3.2 + t * 2.0) + sin(p.y * 4.1 - t * 1.6);
      float glow = smoothstep(0.9, 0.1, abs(ribbon));

      float dist = length(p - pointer);
      float halo = smoothstep(1.4, 0.0, dist);

      float shimmer = fbm(p * 3.2 - t * 1.4);

      vec3 base = vec3(0.06, 0.05, 0.045);
      vec3 gold = vec3(0.78, 0.64, 0.42);
      vec3 pearl = vec3(0.96, 0.92, 0.84);

      vec3 color = base;
      color += gold * glow * 0.8;
      color += pearl * shimmer * 0.18;
      color += gold * halo * 0.45;

      float alpha = (glow * 0.6 + halo * 0.5 + shimmer * 0.2) * uIntensity;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) {
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  const program = gl.createProgram();
  if (!program) {
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return;
  }

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const resolutionLocation = gl.getUniformLocation(program, "uResolution");
  const timeLocation = gl.getUniformLocation(program, "uTime");
  const pointerLocation = gl.getUniformLocation(program, "uPointer");
  const intensityLocation = gl.getUniformLocation(program, "uIntensity");

  if (!resolutionLocation || !timeLocation || !pointerLocation || !intensityLocation) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const intensity = isMobile ? 0.45 : 0.6;
  const maxFps = isMobile ? 36 : 60;
  const frameInterval = 1 / maxFps;

  const pointer = {
    x: 0.5,
    y: 0.3,
    targetX: 0.5,
    targetY: 0.3,
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const width = Math.max(1, Math.floor(window.innerWidth * dpr));
    const height = Math.max(1, Math.floor(window.innerHeight * dpr));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(resolutionLocation, width, height);
    gl.uniform1f(intensityLocation, intensity);
  };

  const updatePointerTarget = (event) => {
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    pointer.targetX = Math.min(1, Math.max(0, event.clientX / width));
    pointer.targetY = Math.min(1, Math.max(0, event.clientY / height));
  };

  const resetPointer = () => {
    pointer.targetX = 0.5;
    pointer.targetY = 0.3;
  };

  const hoverQuery = window.matchMedia("(hover: hover)");
  if (hoverQuery.matches) {
    window.addEventListener("pointermove", updatePointerTarget, { passive: true });
    window.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let rafId = null;
  let lastFrame = 0;

  const drawFrame = (time) => {
    const now = time * 0.001;
    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLocation, now);
    gl.uniform2f(pointerLocation, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const render = (time) => {
    const now = time * 0.001;
    if (now - lastFrame < frameInterval) {
      rafId = requestAnimationFrame(render);
      return;
    }
    lastFrame = now;
    drawFrame(time);
    rafId = requestAnimationFrame(render);
  };

  const start = () => {
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  };

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const resizeState = { raf: null };
  const handleResize = () => {
    if (resizeState.raf) {
      return;
    }
    resizeState.raf = requestAnimationFrame(() => {
      resizeState.raf = null;
      resize();
    });
  };

  resize();

  start();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  window.addEventListener("resize", handleResize, { passive: true });
};

const initInteractiveCards = () => {
  if (prefersReducedMotion || !window.matchMedia("(hover: hover)").matches) {
    return;
  }

  const cards = Array.from(
    document.querySelectorAll(".highlight-card, .card, .collab-card, .stat, blockquote")
  );

  if (cards.length === 0) {
    return;
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const tiltMax = 6;
  const glowMax = 0.85;

  cards.forEach((card) => {
    const state = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      currentGlow: 0,
      targetGlow: 0,
      rafId: null,
    };

    const update = () => {
      state.currentX += (state.targetX - state.currentX) * 0.12;
      state.currentY += (state.targetY - state.currentY) * 0.12;
      state.currentGlow += (state.targetGlow - state.currentGlow) * 0.12;

      const tiltX = (-state.currentY * tiltMax).toFixed(2);
      const tiltY = (state.currentX * tiltMax).toFixed(2);
      const glowX = ((state.currentX + 1) * 50).toFixed(2);
      const glowY = ((state.currentY + 1) * 50).toFixed(2);

      card.style.setProperty("--tilt-x", `${tiltX}deg`);
      card.style.setProperty("--tilt-y", `${tiltY}deg`);
      card.style.setProperty("--glow-x", `${glowX}%`);
      card.style.setProperty("--glow-y", `${glowY}%`);
      card.style.setProperty("--glow-opacity", state.currentGlow.toFixed(2));

      if (
        Math.abs(state.targetX - state.currentX) > 0.005 ||
        Math.abs(state.targetY - state.currentY) > 0.005 ||
        Math.abs(state.targetGlow - state.currentGlow) > 0.01
      ) {
        state.rafId = requestAnimationFrame(update);
      } else {
        state.rafId = null;
      }
    };

    const handleMove = (event) => {
      const rect = card.getBoundingClientRect();
      const width = rect.width || 1;
      const height = rect.height || 1;
      const x = clamp((event.clientX - rect.left) / width, 0, 1);
      const y = clamp((event.clientY - rect.top) / height, 0, 1);
      state.targetX = x * 2 - 1;
      state.targetY = y * 2 - 1;
      state.targetGlow = glowMax;

      if (!state.rafId) {
        state.rafId = requestAnimationFrame(update);
      }
    };

    const handleLeave = () => {
      state.targetX = 0;
      state.targetY = 0;
      state.targetGlow = 0;
      card.style.removeProperty("--transform-duration");
      if (!state.rafId) {
        state.rafId = requestAnimationFrame(update);
      }
    };

    const handleEnter = () => {
      state.targetGlow = glowMax * 0.6;
      card.style.setProperty("--transform-duration", "0.2s");
      if (!state.rafId) {
        state.rafId = requestAnimationFrame(update);
      }
    };

    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerenter", handleEnter);
    card.addEventListener("pointerleave", handleLeave);
    card.addEventListener("blur", handleLeave);
  });
};

const initArtistCarousel = () => {
  const carousel = document.querySelector(".artist-carousel");
  if (!carousel) {
    return;
  }

  const track = carousel.querySelector(".carousel-track");
  const prevButton = carousel.querySelector("[data-carousel-control='prev']");
  const nextButton = carousel.querySelector("[data-carousel-control='next']");
  const cards = Array.from(track?.querySelectorAll(".card") || []);

  if (!track || cards.length === 0) {
    return;
  }

  let rafId = null;

  const getGap = () => {
    const styles = getComputedStyle(track);
    const gapValue = Number.parseFloat(styles.columnGap || styles.gap || "0");
    return Number.isNaN(gapValue) ? 0 : gapValue;
  };

  const getStep = () => {
    const card = cards[0];
    const width = card.getBoundingClientRect().width;
    return width + getGap();
  };

  const setButtonState = (button, disabled) => {
    if (!button) {
      return;
    }
    button.disabled = disabled;
    button.setAttribute("aria-disabled", String(disabled));
  };

  const updateButtons = () => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const current = track.scrollLeft;
    setButtonState(prevButton, current <= 1);
    setButtonState(nextButton, current >= maxScroll - 1);
  };

  const updateActive = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let activeCard = cards[0];
    let minDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        activeCard = card;
      }
    });

    cards.forEach((card) => {
      card.classList.toggle("is-active", card === activeCard);
    });
  };

  const scheduleUpdate = () => {
    if (rafId) {
      return;
    }
    rafId = requestAnimationFrame(() => {
      rafId = null;
      updateButtons();
      updateActive();
    });
  };

  const scrollByStep = (direction) => {
    const step = getStep();
    track.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  prevButton?.addEventListener("click", () => scrollByStep(-1));
  nextButton?.addEventListener("click", () => scrollByStep(1));

  track.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByStep(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByStep(-1);
    }
  });

  scheduleUpdate();
};

const initSpotlight = () => {
  const spotlightTarget = document.querySelector(".page");
  if (!spotlightTarget) {
    return;
  }

  const defaultX = 50;
  const defaultY = 20;

  const setSpotlight = (x, y) => {
    spotlightTarget.style.setProperty("--spot-x", `${x.toFixed(2)}%`);
    spotlightTarget.style.setProperty("--spot-y", `${y.toFixed(2)}%`);
  };

  setSpotlight(defaultX, defaultY);

  if (prefersReducedMotion || !window.matchMedia("(hover: hover)").matches) {
    return;
  }

  const state = {
    currentX: defaultX,
    currentY: defaultY,
    targetX: defaultX,
    targetY: defaultY,
    rafId: null,
  };

  const animate = () => {
    const dx = state.targetX - state.currentX;
    const dy = state.targetY - state.currentY;
    state.currentX += dx * 0.08;
    state.currentY += dy * 0.08;

    setSpotlight(state.currentX, state.currentY);

    if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      state.rafId = requestAnimationFrame(animate);
    } else {
      state.rafId = null;
    }
  };

  const handlePointerMove = (event) => {
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    state.targetX = Math.min(100, Math.max(0, (event.clientX / width) * 100));
    state.targetY = Math.min(100, Math.max(0, (event.clientY / height) * 100));

    if (!state.rafId) {
      state.rafId = requestAnimationFrame(animate);
    }
  };

  const handlePointerLeave = () => {
    state.targetX = defaultX;
    state.targetY = defaultY;
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(animate);
    }
  };

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("blur", handlePointerLeave);
};

const init = () => {
  body.classList.add("is-ready");
  initLanguageToggle();
  applyStagger();
  initReveal();
  initNavHighlight();
  initParallax();
  initStageCanvas();
  initInteractiveCards();
  initArtistCarousel();
  initSpotlight();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
