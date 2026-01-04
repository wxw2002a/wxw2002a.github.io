const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const metaDescription = document.querySelector('meta[name="description"]');

const translations = {
  "en": {
    "meta": {
      "title": "Xiwei Wang - Portfolio",
      "description": "Xiwei Wang is a full-stack mobile and backend developer with experience in React Native, Node.js/Express, C++/Qt, and Django."
    },
    "nav": {
      "education": "Education",
      "internships": "Internships",
      "projects": "Projects",
      "skills": "Skills",
      "contact": "Contact",
      "resume": "Resume",
      "langToggle": "EN/\u4e2d\u6587"
    },
    "hero": {
      "name": "Xiwei Wang",
      "tagline": "MEng Electrical and Computer Engineering (Software Engineering) at University of Waterloo | Full-stack mobile and backend developer",
      "pill": "Full-stack mobile | Real-time systems | Secure delivery",
      "summary": "I build multi-role mobile apps, REST APIs, and industrial vision pipelines with a focus on performance, reliability, and clean delivery.",
      "ctaInternships": "View Internships",
      "ctaEmail": "Email",
      "current": "Currently",
      "labels": {
        "study": "Study:",
        "email": "Email:",
        "phone": "Phone:",
        "website": "Website:"
      },
      "currentStudy": "Master of Electrical and Computer Engineering (Software Engineering), University of Waterloo"
    },
    "edu": {
      "title": "Education",
      "subtitle": "Graduate and undergraduate training focused on software engineering foundations and applied systems.",
      "uw": {
        "name": "University of Waterloo",
        "degree": "Master of Electrical and Computer Engineering (Software Engineering)",
        "date": "09/2025 - 12/2026"
      },
      "ysu": {
        "name": "Yanshan University",
        "degree": "Bachelor of Electronic Science and Technology | GPA 86/100",
        "date": "09/2021 - 06/2025"
      }
    },
    "exp": {
      "title": "Internships",
      "selest": {
        "name": "SELEST Security",
        "date": "09/2025 - 12/2025",
        "role": "Mobile Application Full Stack Developer | Ontario, Canada",
        "b1": "Built and shipped a multi-role security concierge app with React Native and TypeScript.",
        "b2": "Implemented email, Google OAuth, and phone sign-in with role-based access for customers, guards, and admins.",
        "b3": "Delivered booking and shift workflows with Node.js/Express APIs, including incident reporting and credential uploads.",
        "b4": "Designed operational data with MySQL and MongoDB, adding Redis caching for low-latency reads.",
        "b5": "Integrated PayPal checkout via backend functions and in-app WebView for payment capture."
      },
      "hit": {
        "name": "Harbin Institute of Technology Robot Technology Research Institute",
        "date": "06/2025 - 08/2025",
        "role": "Industrial Vision Platform Development Intern | China",
        "b1": "Built a real-time inspection application in C++ with Qt on Linux for teacup defect detection (up to 600 fps).",
        "b2": "Deployed a Django service for result logging, model parameter sync, and offline frame analysis via REST APIs.",
        "b3": "Collaborated with the algorithm team to connect trained models and improved detection speed by 23%."
      },
      "sino": {
        "name": "Sinopec Group",
        "date": "07/2024 - 08/2024",
        "role": "Application Intern, Information Center | China",
        "b1": "Contributed to an unmanned warehouse storage system and robot control system integration.",
        "b2": "Applied reinforcement learning (Stable-Baselines3 PPO) to optimize AGV scheduling and path planning.",
        "b3": "Implemented QR and 2D code recognition with Pyzbar and connected results to backend services.",
        "b4": "Used Redis to cache high-frequency operational states for real-time dispatch."
      }
    },
    "proj": {
      "title": "Projects",
      "filter": {
        "all": "All",
        "systems": "Systems",
        "aiml": "AI/ML",
        "gpu": "GPU"
      },
      "java": {
        "title": "High-Performance Java Server for Networked Applications",
        "desc": "Multithreaded Java TCP server on Ubuntu with socket-level tuning; reduced latency from 120 ms to ~40 ms, aiming for < 30 ms."
      },
      "cuda": {
        "title": "CUDA Convolution Acceleration",
        "desc": "Implemented 2D convolution CUDA kernels (CUDA 12.4 on RTX 3070) and Python benchmarks..."
      },
      "yam": {
        "title": "Audio Anomaly Detection",
        "desc": "YAMNet-based classification with thresholding to reduce false positives in industrial environments."
      },
      "roi": {
        "title": "Template/ROI Toolkit",
        "desc": "Proportional template fitting and ROI parameter panels for inspection UI without distortion."
      }
    },
    "skills": {
      "title": "Skills",
      "languages": {
        "title": "Languages",
        "list": "C/C++, Python, Java, HTML, CSS, JavaScript, TypeScript, SQL"
      },
      "frameworks": {
        "title": "Frameworks",
        "list": "React, React Native, Node.js/Express, Django"
      },
      "databases": {
        "title": "Databases",
        "list": "MySQL, Redis, MongoDB"
      },
      "tools": {
        "title": "Tools",
        "list": "Git, Linux, Bash, REST"
      },
      "spoken": {
        "title": "Spoken Languages",
        "list": "English (fluent), Chinese (native), French (sufficient)"
      }
    },
    "contact": {
      "title": "Contact",
      "email": "Email",
      "phone": "Phone"
    },
    "mode": {
      "auto": "Auto",
      "day": "Day",
      "night": "Night"
    }
  },
  "zh": {
    "meta": {
      "title": "\u738b\u7199\u851a - \u4f5c\u54c1\u96c6",
      "description": "\u738b\u7199\u851a\u662f\u5168\u6808\u79fb\u52a8\u4e0e\u540e\u7aef\u5f00\u53d1\u8005\uff0c\u5177\u6709 React Native\uff0cNode.js/Express\uff0cC++/Qt\uff0cDjango \u5b9e\u6218\u7ecf\u9a8c\u3002"
    },
    "nav": {
      "education": "\u6559\u80b2",
      "internships": "\u5b9e\u4e60",
      "projects": "\u9879\u76ee",
      "skills": "\u6280\u80fd",
      "contact": "\u8054\u7cfb",
      "resume": "\u7b80\u5386",
      "langToggle": "\u4e2d\u6587/EN"
    },
    "hero": {
      "name": "\u738b\u7199\u851a",
      "tagline": "\u6ed1\u94c1\u5361\u5927\u5b66\u7535\u5b50\u4e0e\u8ba1\u7b97\u673a\u5de5\u7a0b\u7855\u58eb\uff08\u8f6f\u4ef6\u5de5\u7a0b\uff09 | \u5168\u6808\u79fb\u52a8\u4e0e\u540e\u7aef\u5f00\u53d1",
      "pill": "\u5168\u6808\u79fb\u52a8 | \u5b9e\u65f6\u7cfb\u7edf | \u7a33\u5b9a\u4ea4\u4ed8",
      "summary": "\u6211\u6784\u5efa\u591a\u89d2\u8272\u79fb\u52a8\u5e94\u7528\u3001REST API \u4e0e\u5de5\u4e1a\u89c6\u89c9\u6d41\u6c34\u7ebf\uff0c\u5173\u6ce8\u6027\u80fd\u3001\u7a33\u5b9a\u6027\u4e0e\u4ea4\u4ed8\u8d28\u91cf\u3002",
      "ctaInternships": "\u67e5\u770b\u5b9e\u4e60",
      "ctaEmail": "\u90ae\u4ef6",
      "current": "\u5f53\u524d",
      "labels": {
        "study": "\u5b66\u4e60:",
        "email": "\u90ae\u7bb1:",
        "phone": "\u7535\u8bdd:",
        "website": "\u7f51\u7ad9:"
      },
      "currentStudy": "\u7535\u5b50\u4e0e\u8ba1\u7b97\u673a\u5de5\u7a0b\u7855\u58eb\uff08\u8f6f\u4ef6\u5de5\u7a0b\uff09\uff0c\u6ed1\u94c1\u5361\u5927\u5b66"
    },
    "edu": {
      "title": "\u6559\u80b2",
      "subtitle": "\u7814\u7a76\u751f\u4e0e\u672c\u79d1\u6559\u80b2\u7ecf\u5386\uff0c\u4fa7\u91cd\u8f6f\u4ef6\u5de5\u7a0b\u57fa\u7840\u4e0e\u7cfb\u7edf\u5e94\u7528\u3002",
      "uw": {
        "name": "\u6ed1\u94c1\u5361\u5927\u5b66",
        "degree": "\u7535\u5b50\u4e0e\u8ba1\u7b97\u673a\u5de5\u7a0b\u7855\u58eb\uff08\u8f6f\u4ef6\u5de5\u7a0b\uff09",
        "date": "09/2025 - 12/2026"
      },
      "ysu": {
        "name": "\u71d5\u5c71\u5927\u5b66",
        "degree": "\u7535\u5b50\u79d1\u5b66\u4e0e\u6280\u672f\u5b66\u58eb | GPA 86/100",
        "date": "09/2021 - 06/2025"
      }
    },
    "exp": {
      "title": "\u5b9e\u4e60\u7ecf\u5386",
      "selest": {
        "name": "SELEST Security",
        "date": "09/2025 - 12/2025",
        "role": "\u79fb\u52a8\u5e94\u7528\u5168\u6808\u5f00\u53d1 | \u52a0\u62ff\u5927\u00b7\u5b89\u5927\u7565",
        "b1": "\u4f7f\u7528 React Native \u4e0e TypeScript \u5f00\u53d1\u5e76\u4e0a\u7ebf\u591a\u89d2\u8272\u5b89\u4fdd\u7ba1\u5bb6\u5e94\u7528\u3002",
        "b2": "\u5b9e\u73b0\u90ae\u7bb1\u3001Google OAuth\u3001\u624b\u673a\u53f7\u767b\u5f55\u4e0e\u5ba2\u6237/\u4fdd\u5b89/\u7ba1\u7406\u5458\u7684\u89d2\u8272\u6743\u9650\u3002",
        "b3": "\u901a\u8fc7 Node.js/Express API \u4ea4\u4ed8\u9884\u7ea6\u4e0e\u6392\u73ed\u6d41\u7a0b\uff0c\u5305\u62ec\u4e8b\u4ef6\u4e0a\u62a5\u4e0e\u8d44\u8d28\u4e0a\u4f20\u3002",
        "b4": "\u4f7f\u7528 MySQL \u4e0e MongoDB \u8bbe\u8ba1\u4e1a\u52a1\u6570\u636e\uff0c\u901a\u8fc7 Redis \u7f13\u5b58\u63d0\u5347\u4f4e\u5ef6\u8fdf\u8bbf\u95ee\u3002",
        "b5": "\u901a\u8fc7\u540e\u7aef\u51fd\u6570\u4e0e\u5e94\u7528\u5185 WebView \u96c6\u6210 PayPal \u652f\u4ed8\u3002"
      },
      "hit": {
        "name": "\u54c8\u5de5\u5927\u673a\u5668\u4eba\u6280\u672f\u7814\u7a76\u6240",
        "date": "06/2025 - 08/2025",
        "role": "\u5de5\u4e1a\u89c6\u89c9\u5e73\u53f0\u5f00\u53d1\u5b9e\u4e60 | \u4e2d\u56fd",
        "b1": "\u5728 Linux \u4e0a\u4f7f\u7528 C++/Qt \u6784\u5efa\u5b9e\u65f6\u68c0\u6d4b\u5e94\u7528\uff0c\u7528\u4e8e\u8336\u676f\u7f3a\u9677\u8bc6\u522b\uff08\u6700\u9ad8 600 fps\uff09\u3002",
        "b2": "\u90e8\u7f72 Django \u670d\u52a1\u7528\u4e8e\u7ed3\u679c\u8bb0\u5f55\u3001\u6a21\u578b\u53c2\u6570\u540c\u6b65\u4e0e\u79bb\u7ebf\u5e27\u5206\u6790\uff08REST API\uff09\u3002",
        "b3": "\u4e0e\u7b97\u6cd5\u56e2\u961f\u5bf9\u63a5\u8bad\u7ec3\u6a21\u578b\uff0c\u68c0\u6d4b\u901f\u5ea6\u63d0\u5347 23%\u3002"
      },
      "sino": {
        "name": "\u4e2d\u56fd\u77f3\u5316\u96c6\u56e2",
        "date": "07/2024 - 08/2024",
        "role": "\u4fe1\u606f\u4e2d\u5fc3\u5e94\u7528\u5b9e\u4e60 | \u4e2d\u56fd",
        "b1": "\u53c2\u4e0e\u65e0\u4eba\u4ed3\u50a8\u7cfb\u7edf\u4e0e\u673a\u5668\u4eba\u63a7\u5236\u7cfb\u7edf\uff08RCS\uff09\u96c6\u6210\u3002",
        "b2": "\u4f7f\u7528\u5f3a\u5316\u5b66\u4e60\uff08Stable-Baselines3 PPO\uff09\u4f18\u5316 AGV \u8c03\u5ea6\u4e0e\u8def\u5f84\u89c4\u5212\u3002",
        "b3": "\u7528 Pyzbar \u5b9e\u73b0\u4e8c\u7ef4\u7801/\u4e8c\u7ef4\u7801\u8bc6\u522b\u5e76\u5bf9\u63a5\u540e\u7aef\u670d\u52a1\u3002",
        "b4": "\u4f7f\u7528 Redis \u7f13\u5b58\u9ad8\u9891\u72b6\u6001\uff0c\u652f\u6301\u5b9e\u65f6\u8c03\u5ea6\u3002"
      }
    },
    "proj": {
      "title": "\u9879\u76ee",
      "filter": {
        "all": "\u5168\u90e8",
        "systems": "\u7cfb\u7edf",
        "aiml": "AI/ML",
        "gpu": "GPU"
      },
      "java": {
        "title": "\u9ad8\u6027\u80fd Java \u7f51\u7edc\u670d\u52a1\u5668",
        "desc": "Ubuntu \u4e0b\u591a\u7ebf\u7a0b Java TCP \u670d\u52a1\u5668\uff0c\u7f51\u7edc\u5957\u63a5\u5b57\u7ea7\u8c03\u4f18\uff1b\u5ef6\u8fdf\u7531 120 ms \u964d\u81f3 ~40 ms\uff0c\u76ee\u6807 < 30 ms\u3002"
      },
      "cuda": {
        "title": "CUDA \u5377\u79ef\u52a0\u901f",
        "desc": "\u7f16\u5199 2D \u5377\u79ef CUDA kernel\uff08CUDA 12.4 / RTX 3070\uff09\u5e76\u5b9e\u73b0 Python \u6027\u80fd\u57fa\u51c6..."
      },
      "yam": {
        "title": "\u97f3\u9891\u5f02\u5e38\u68c0\u6d4b",
        "desc": "\u57fa\u4e8e YAMNet \u7684\u5206\u7c7b\u4e0e\u9608\u503c\u7b56\u7565\uff0c\u964d\u4f4e\u5de5\u4e1a\u73af\u5883\u8bef\u62a5\u3002"
      },
      "roi": {
        "title": "\u6a21\u677f/ROI \u5de5\u5177\u5305",
        "desc": "\u6bd4\u4f8b\u6a21\u677f\u62df\u5408\u4e0e ROI \u53c2\u6570\u9762\u677f\uff0c\u4fdd\u6301\u68c0\u6d4b\u754c\u9762\u65e0\u5931\u771f\u3002"
      }
    },
    "skills": {
      "title": "\u6280\u80fd",
      "languages": {
        "title": "\u7f16\u7a0b\u8bed\u8a00",
        "list": "C/C++, Python, Java, HTML, CSS, JavaScript, TypeScript, SQL"
      },
      "frameworks": {
        "title": "\u6846\u67b6",
        "list": "React, React Native, Node.js/Express, Django"
      },
      "databases": {
        "title": "\u6570\u636e\u5e93",
        "list": "MySQL, Redis, MongoDB"
      },
      "tools": {
        "title": "\u5de5\u5177",
        "list": "Git, Linux, Bash, REST"
      },
      "spoken": {
        "title": "\u8bed\u8a00",
        "list": "\u82f1\u8bed\uff08\u6d41\u5229\uff09\uff0c\u4e2d\u6587\uff08\u6bcd\u8bed\uff09\uff0c\u6cd5\u8bed\uff08\u57fa\u7840\uff09"
      }
    },
    "contact": {
      "title": "\u8054\u7cfb",
      "email": "\u90ae\u7bb1",
      "phone": "\u7535\u8bdd"
    },
    "mode": {
      "auto": "\u81ea\u52a8",
      "day": "\u767d\u5929",
      "night": "\u591c\u95f4"
    }
  }
};

let currentLang = "en";
let currentMode = "auto";
let updateModeLabel = () => {};

const getPathValue = (obj, path) => {
  if (!obj || !path) {
    return undefined;
  }
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const getModeLabel = (mode) => {
  const dict = translations[currentLang] || translations.en;
  return dict?.mode?.[mode] || mode;
};

const applyLanguage = (lang) => {
  const safeLang = lang === "zh" ? "zh" : "en";
  currentLang = safeLang;
  const dict = translations[safeLang] || translations.en;
  document.documentElement.lang = safeLang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = getPathValue(dict, key);
    if (value) {
      element.textContent = value;
    }
  });

  if (dict?.meta?.title) {
    document.title = dict.meta.title;
  }
  if (dict?.meta?.description && metaDescription) {
    metaDescription.setAttribute("content", dict.meta.description);
  }

  updateModeLabel();

  try {
    localStorage.setItem("lang", safeLang);
  } catch (error) {
    // Ignore storage access errors.
  }
};

const initLanguageToggle = () => {
  let initialLang = "en";
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "zh") {
      initialLang = "zh";
    }
  } catch (error) {
    initialLang = "en";
  }

  applyLanguage(initialLang);

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = currentLang === "en" ? "zh" : "en";
      applyLanguage(next);
    });
  }
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
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
};

const initNavHighlight = () => {
  const navLinks = Array.from(document.querySelectorAll(".links a[href^='#']"));
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

const initProjectFilters = () => {
  const chips = Array.from(document.querySelectorAll(".chip[data-filter]"));
  const cards = Array.from(document.querySelectorAll(".project[data-kind]"));
  if (chips.length === 0 || cards.length === 0) {
    return;
  }

  let current = "All";

  const applyFilter = () => {
    cards.forEach((card) => {
      const kind = card.getAttribute("data-kind");
      card.style.display = current === "All" || current === kind ? "" : "none";
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      current = chip.dataset.filter || "All";
      chips.forEach((item) => item.classList.toggle("active", item === chip));
      applyFilter();
    });
  });

  applyFilter();
};

const initRipples = () => {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointerdown", (event) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty("--rx", `${event.clientX - rect.left}px`);
      btn.style.setProperty("--ry", `${event.clientY - rect.top}px`);
      btn.classList.add("rippling");
      setTimeout(() => btn.classList.remove("rippling"), 300);
    });
  });
};

const initFxCanvas = () => {
  if (prefersReducedMotion) {
    return;
  }
  const canvas = document.getElementById("fx");
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  let w = 0;
  let h = 0;
  let dpr = 1;
  const dots = [];

  const resize = () => {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };

  window.addEventListener("resize", resize, { passive: true });
  resize();

  const count = Math.min(70, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < count; i += 1) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.3 + 0.6) * dpr,
      vx: (Math.random() - 0.5) * 0.08 * dpr,
      vy: (Math.random() - 0.5) * 0.08 * dpr,
      a: 0.3 + Math.random() * 0.4,
    });
  }

  const step = () => {
    ctx.clearRect(0, 0, w, h);
    dots.forEach((dot) => {
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.x < 0 || dot.x > w) {
        dot.vx *= -1;
      }
      if (dot.y < 0 || dot.y > h) {
        dot.vy *= -1;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(180, 220, 255, ${dot.a})`;
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });
    window.requestAnimationFrame(step);
  };

  step();
};

const initSkyline = () => {
  const root = document.documentElement.style;
  const skyline = document.querySelector(".skyline");
  const dayUrl = "https://upload.wikimedia.org/wikipedia/commons/2/26/Skyline_of_Toronto_viewed_from_Harbour.jpg";
  const nightUrl = "https://upload.wikimedia.org/wikipedia/commons/1/13/Toronto_at_Dusk_-a.jpg";

  root.setProperty("--skyline-day-url", `url('${dayUrl}')`);
  root.setProperty("--skyline-night-url", `url('${nightUrl}')`);

  [dayUrl, nightUrl].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  const label = document.getElementById("mode-label");
  let mode = localStorage.getItem("mode") || "auto";
  let timer = null;

  updateModeLabel = () => {
    if (label) {
      label.textContent = getModeLabel(currentMode);
    }
  };

  const torontoHour = () => {
    try {
      const hour = Number.parseInt(
        new Intl.DateTimeFormat("en-CA", { hour: "numeric", hour12: false, timeZone: "America/Toronto" }).format(
          new Date()
        ),
        10
      );
      return Number.isNaN(hour) ? new Date().getHours() : hour;
    } catch (error) {
      return new Date().getHours();
    }
  };

  const isDayByClock = () => {
    const hour = torontoHour();
    return hour >= 6 && hour <= 19;
  };

  const applyMode = (next) => {
    currentMode = next;
    const isDay = next === "day" ? true : next === "night" ? false : isDayByClock();
    document.body.classList.toggle("day", isDay);
    document.body.classList.toggle("night", !isDay);

    updateModeLabel();

    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (next === "auto") {
      timer = setInterval(() => applyMode("auto"), 600000);
    }
  };

  applyMode(mode);

  const toggle = document.getElementById("mode-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      mode = mode === "auto" ? "day" : mode === "day" ? "night" : "auto";
      localStorage.setItem("mode", mode);
      applyMode(mode);
    });
  }

  const enableParallax = window.matchMedia("(pointer:fine)").matches && !prefersReducedMotion;
  if (enableParallax && skyline) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const dx = (event.clientX / window.innerWidth - 0.5) * 10;
        const dy = (event.clientY / window.innerHeight - 0.5) * 6;
        skyline.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      },
      { passive: true }
    );
    window.addEventListener(
      "pointerleave",
      () => {
        skyline.style.transform = "translate3d(0, 0, 0)";
      },
      { passive: true }
    );
  }
};

const init = () => {
  document.body.classList.add("is-ready");
  initLanguageToggle();
  applyStagger();
  initReveal();
  initNavHighlight();
  initProjectFilters();
  initRipples();
  initSkyline();
  initFxCanvas();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
