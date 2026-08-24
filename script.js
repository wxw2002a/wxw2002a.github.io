(() => {
  "use strict";

  const translations = {
    en: {
      "meta.title": "Xiwei Wang — Full-Stack & AI Product Engineer",
      "meta.description": "Xiwei Wang is a full-stack engineer and University of Waterloo MEng candidate building AI-powered products, cross-platform applications, backend services, and real-time systems.",
      "meta.socialDescription": "Product-minded engineering across AI, mobile, backend, cloud, and real-time systems.",
      "access.skip": "Skip to main content",
      "access.home": "Xiwei Wang — Home",
      "access.navigation": "Primary navigation",
      "access.language": "切换到中文",
      "access.theme": "Switch color theme",
      "access.themeLight": "Switch to light theme",
      "access.themeDark": "Switch to dark theme",
      "access.menu": "Open menu",
      "access.menuClose": "Close menu",
      "access.quickLinks": "Quick links",
      "access.highlights": "Engineering highlights",
      "access.scroll": "Scroll to profile",
      "access.filters": "Filter projects",
      "brand.role": "Engineer / Builder",
      "nav.profile": "Profile",
      "nav.experience": "Experience",
      "nav.work": "Work",
      "nav.background": "Background",
      "nav.contact": "Contact",
      "nav.language": "Language",
      "hero.eyebrow": "Full-stack / AI product engineer",
      "hero.lede": "I turn product requirements into shipped mobile, backend, AI, and real-time systems—connecting technical direction with hands-on delivery.",
      "hero.study": "MEng candidate in Software Engineering · University of Waterloo · 2026",
      "hero.ctaWork": "Explore my work",
      "hero.ctaResume": "Download résumé",
      "hero.signal": "SYSTEMS ONLINE",
      "hero.scroll": "Scroll to explore",
      "metrics.title": "Selected impact",
      "metrics.workstreamsTitle": "Cross-functional workstreams",
      "metrics.workstreamsText": "Led from planning through integration and delivery",
      "metrics.responseTitle": "Average response time",
      "metrics.responseText": "Improved through API and database optimization",
      "metrics.visionTitle": "Images per second",
      "metrics.visionText": "Processed from live camera feeds in C++ / Qt",
      "profile.title": "Product thinking. Engineering depth.",
      "profile.intro": "I’m an Electrical and Computer Engineering MEng candidate at the University of Waterloo. My work spans product planning, cross-platform apps, backend services, AI pipelines, cloud deployment, and real-time industrial software.",
      "profile.deliveryTitle": "Product delivery",
      "profile.deliveryText": "Translate requirements into technical priorities, align milestones, resolve cross-team blockers, and carry releases through integration.",
      "profile.fullstackTitle": "Full-stack products",
      "profile.fullstackText": "Build mobile and web experiences with React, React Native, and Flutter, backed by Node.js, Spring Boot, Django, and structured data systems.",
      "profile.systemsTitle": "AI & real-time systems",
      "profile.systemsText": "Connect LLM and image-generation services in the cloud, and engineer performance-sensitive C++/Qt vision applications on Linux.",
      "experience.title": "From product direction to production delivery.",
      "experience.intro": "Five roles across AI products, mobile platforms, backend systems, and industrial automation.",
      "experience.details": "Role details",
      "experience.ipmd.role": "Technical Manager Intern",
      "experience.ipmd.badge": "AI PRODUCT",
      "experience.ipmd.b1": "Led 6 cross-functional workstreams across frontend, backend, AI/ML, design, and product, moving the “Image Cards to Fine Arts” MVP from planning through integration and delivery.",
      "experience.ipmd.b2": "Developed and deployed an AI image-generation platform on Microsoft Azure using React, TypeScript, Node.js/Express, Qwen/Gemini, and Stable Diffusion 1.5.",
      "experience.ipmd.b3": "Coordinated Dockerized frontend, API, LLM, and Stable Diffusion services for end-to-end integration and release readiness.",
      "experience.folo.role": "Full-Stack Developer",
      "experience.folo.metric": "response time",
      "experience.folo.b1": "Developed Flutter clients and Kotlin/Spring Boot services for user, task, recommendation, and warehouse workflows.",
      "experience.folo.b2": "Designed PostgreSQL, MySQL, and Redis data flows and optimized API/database interactions, reducing average response time by 25%.",
      "experience.selest.role": "Full-Stack Developer",
      "experience.selest.metric": "workflows",
      "experience.selest.b1": "Built and shipped a multi-role React Native application, supporting testing and production releases to the App Store and Google Play.",
      "experience.selest.b2": "Integrated Node.js/Express REST APIs with MongoDB to deliver 5+ booking and shift-management workflows.",
      "experience.hit.role": "Industrial Vision Platform Development Intern",
      "experience.hit.metric": "images / sec",
      "experience.hit.b1": "Developed a real-time C++/Qt application on Linux that processed up to 600 images per second from live camera feeds.",
      "experience.hit.b2": "Built a Python/Django REST backend for detection logging, parameter synchronization, and offline frame analysis.",
      "experience.sinopec.role": "Application Intern, Information Center",
      "experience.sinopec.badge": "AUTOMATION",
      "experience.sinopec.b1": "Integrated and tested software components for an unmanned warehouse digital storage system and Robot Control System.",
      "experience.sinopec.b2": "Implemented QR/2D-code recognition with Python and Pyzbar, connecting scan results to backend services.",
      "work.title": "Engineering beyond the happy path.",
      "work.intro": "Selected systems, GPU, and applied AI work from my engineering portfolio.",
      "work.filterAll": "All",
      "work.filterSystems": "Systems",
      "work.filterAI": "AI / ML",
      "work.java.title": "High-Performance Java Server",
      "work.java.text": "A multithreaded Java TCP server on Ubuntu with socket-level tuning, reducing latency from 120 ms to approximately 40 ms.",
      "work.cuda.title": "CUDA Convolution Acceleration",
      "work.cuda.text": "Implemented 2D convolution CUDA kernels on an RTX 3070 and built Python benchmarks for performance evaluation.",
      "work.audio.title": "Audio Anomaly Detection",
      "work.audio.text": "YAMNet-based classification with thresholding designed to reduce false positives in industrial environments.",
      "work.roi.title": "Template / ROI Toolkit",
      "work.roi.text": "Proportional template fitting and ROI parameter controls for distortion-free industrial inspection interfaces.",
      "education.title": "Always learning. Always shipping.",
      "education.intro": "Graduate study in software engineering builds on a foundation in electronic science and technology.",
      "education.resume": "View full résumé",
      "education.waterloo.degree": "Master of Engineering in Electrical & Computer Engineering",
      "education.waterloo.detail": "Software Engineering · Expected December 2026",
      "education.yanshan.degree": "Bachelor of Electronic Science & Technology",
      "education.yanshan.detail": "GPA 86 / 100",
      "background.title": "Education meets engineering practice.",
      "background.intro": "Graduate software engineering study backed by an electronic systems foundation and a practical full-stack toolkit.",
      "background.education": "Education",
      "background.toolkit": "Technical toolkit",
      "skills.title": "The right tool for the system.",
      "skills.intro": "A practical stack spanning client applications, services, data, cloud, and performance engineering.",
      "skills.languages": "Languages",
      "skills.frameworks": "Frameworks",
      "skills.data": "Data",
      "skills.platform": "Cloud & tools",
      "skills.spoken": "Spoken languages",
      "skills.spokenList": "English — fluent · Chinese — native · French — sufficient",
      "contact.title": "Let’s build something that holds up.",
      "contact.intro": "For full-stack, AI-enabled product, or systems work, email is the fastest way to reach me.",
      "contact.emailLabel": "Start a conversation",
      "contact.githubLabel": "GitHub",
      "contact.resumeLabel": "Résumé",
      "contact.resumeAction": "View PDF",
      "footer.note": "Designed and engineered with intention.",
      "footer.top": "Back to top ↑"
    },
    zh: {
      "meta.title": "Xiwei Wang — 全栈与 AI 产品工程师",
      "meta.description": "Xiwei Wang，滑铁卢大学电子与计算机工程硕士在读，专注 AI 产品、跨平台应用、后端服务与实时系统。",
      "meta.socialDescription": "横跨 AI、移动端、后端、云平台与实时系统的产品型工程实践。",
      "access.skip": "跳至主要内容",
      "access.home": "Xiwei Wang — 首页",
      "access.navigation": "主导航",
      "access.language": "Switch to English",
      "access.theme": "切换颜色主题",
      "access.themeLight": "切换至浅色主题",
      "access.themeDark": "切换至深色主题",
      "access.menu": "打开菜单",
      "access.menuClose": "关闭菜单",
      "access.quickLinks": "快捷链接",
      "access.highlights": "工程成果亮点",
      "access.scroll": "滚动至个人简介",
      "access.filters": "筛选项目",
      "brand.role": "工程师 / 构建者",
      "nav.profile": "简介",
      "nav.experience": "经历",
      "nav.work": "项目",
      "nav.background": "背景",
      "nav.contact": "联系",
      "nav.language": "语言",
      "hero.eyebrow": "全栈 / AI 产品工程师",
      "hero.lede": "我把产品需求转化为真正交付的移动端、后端、AI 与实时系统，将技术方向与一线工程实践连接起来。",
      "hero.study": "滑铁卢大学软件工程方向 · 工程硕士在读 · 2026",
      "hero.ctaWork": "查看我的经历",
      "hero.ctaResume": "下载简历",
      "hero.signal": "系统在线",
      "hero.scroll": "向下探索",
      "metrics.title": "成果概览",
      "metrics.workstreamsTitle": "条跨职能工作流",
      "metrics.workstreamsText": "从规划、集成推进至最终交付",
      "metrics.responseTitle": "平均响应时间",
      "metrics.responseText": "通过 API 与数据库优化实现提升",
      "metrics.visionTitle": "每秒处理图像",
      "metrics.visionText": "使用 C++ / Qt 处理实时相机数据流",
      "profile.title": "产品思维，工程深度。",
      "profile.intro": "我就读于滑铁卢大学电子与计算机工程硕士项目，方向为软件工程。我的实践覆盖产品规划、跨平台应用、后端服务、AI 流水线、云端部署与实时工业软件。",
      "profile.deliveryTitle": "产品交付",
      "profile.deliveryText": "将需求转化为技术优先级，协调里程碑，解决跨团队阻塞，并推动产品完成集成与发布。",
      "profile.fullstackTitle": "全栈产品",
      "profile.fullstackText": "使用 React、React Native 与 Flutter 构建移动端和 Web 体验，并以 Node.js、Spring Boot、Django 与结构化数据系统提供支撑。",
      "profile.systemsTitle": "AI 与实时系统",
      "profile.systemsText": "在云端连接大语言模型与图像生成服务，并在 Linux 上开发性能敏感的 C++/Qt 视觉应用。",
      "experience.title": "从产品方向，到生产交付。",
      "experience.intro": "五段实践经历，覆盖 AI 产品、移动平台、后端系统与工业自动化。",
      "experience.details": "工作详情",
      "experience.ipmd.role": "技术经理实习生",
      "experience.ipmd.badge": "AI 产品",
      "experience.ipmd.b1": "统筹前端、后端、AI/ML、设计与产品等 6 条跨职能工作流，推动“Image Cards to Fine Arts” MVP 从规划走向集成与交付。",
      "experience.ipmd.b2": "使用 React、TypeScript、Node.js/Express、Qwen/Gemini 与 Stable Diffusion 1.5，在 Microsoft Azure 上开发并部署 AI 图像生成平台。",
      "experience.ipmd.b3": "协调容器化前端、API、LLM 与 Stable Diffusion 服务，完成端到端系统集成和发布准备。",
      "experience.folo.role": "全栈开发工程师",
      "experience.folo.metric": "响应时间",
      "experience.folo.b1": "使用 Flutter 客户端与 Kotlin/Spring Boot 服务开发用户、任务、推荐及仓库工作流。",
      "experience.folo.b2": "设计 PostgreSQL、MySQL 与 Redis 数据流并优化 API/数据库交互，使平均响应时间降低 25%。",
      "experience.selest.role": "全栈开发工程师",
      "experience.selest.metric": "条工作流",
      "experience.selest.b1": "构建并发布多角色 React Native 应用，支持 App Store 与 Google Play 的测试和生产发布。",
      "experience.selest.b2": "集成 Node.js/Express REST API 与 MongoDB，交付 5 条以上预订及排班管理工作流。",
      "experience.hit.role": "工业视觉平台开发实习生",
      "experience.hit.metric": "图像 / 秒",
      "experience.hit.b1": "在 Linux 上开发实时 C++/Qt 应用，处理现场相机数据流，速度最高达每秒 600 张图像。",
      "experience.hit.b2": "使用 Python/Django REST 构建检测日志、参数同步与离线帧分析后端。",
      "experience.sinopec.role": "信息中心应用实习生",
      "experience.sinopec.badge": "工业自动化",
      "experience.sinopec.b1": "为无人仓库数字存储系统与机器人控制系统集成并测试软件组件。",
      "experience.sinopec.b2": "使用 Python 与 Pyzbar 实现 QR/二维条码识别，并将扫描结果接入后端服务。",
      "work.title": "为复杂场景而工程。",
      "work.intro": "从个人工程作品中精选的系统、GPU 与应用型 AI 项目。",
      "work.filterAll": "全部",
      "work.filterSystems": "系统",
      "work.filterAI": "AI / 机器学习",
      "work.java.title": "高性能 Java 网络服务器",
      "work.java.text": "在 Ubuntu 上实现多线程 Java TCP 服务器并进行套接字级调优，将延迟从 120 ms 降至约 40 ms。",
      "work.cuda.title": "CUDA 卷积加速",
      "work.cuda.text": "在 RTX 3070 上实现二维卷积 CUDA 内核，并编写 Python 基准测试以评估性能。",
      "work.audio.title": "音频异常检测",
      "work.audio.text": "基于 YAMNet 的分类与阈值策略，旨在降低工业环境中的误报。",
      "work.roi.title": "模板 / ROI 工具包",
      "work.roi.text": "面向工业检测界面的等比例模板适配与 ROI 参数控制，避免图像失真。",
      "education.title": "持续学习，持续交付。",
      "education.intro": "以电子科学与技术为基础，在研究生阶段继续深入软件工程。",
      "education.resume": "查看完整简历",
      "education.waterloo.degree": "电子与计算机工程硕士",
      "education.waterloo.detail": "软件工程方向 · 预计 2026 年 12 月毕业",
      "education.yanshan.degree": "电子科学与技术学士",
      "education.yanshan.detail": "GPA 86 / 100",
      "background.title": "让教育背景与工程实践相互支撑。",
      "background.intro": "以电子系统为基础，在研究生阶段深入软件工程，并形成一套实用的全栈技术工具箱。",
      "background.education": "教育经历",
      "background.toolkit": "技术工具箱",
      "skills.title": "为系统选择合适工具。",
      "skills.intro": "一套覆盖客户端、服务端、数据、云平台与性能工程的实用技术栈。",
      "skills.languages": "编程语言",
      "skills.frameworks": "框架",
      "skills.data": "数据系统",
      "skills.platform": "云平台与工具",
      "skills.spoken": "语言能力",
      "skills.spokenList": "英语 — 流利 · 中文 — 母语 · 法语 — 基础沟通",
      "contact.title": "一起构建经得起检验的产品。",
      "contact.intro": "如果你想讨论全栈开发、AI 产品或系统工程，电子邮件是联系我的最快方式。",
      "contact.emailLabel": "发起交流",
      "contact.githubLabel": "GitHub",
      "contact.resumeLabel": "简历",
      "contact.resumeAction": "查看 PDF",
      "footer.note": "用心设计，认真构建。",
      "footer.top": "返回顶部 ↑"
    }
  };

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentLanguage = "en";
  let menuOpen = false;

  const readStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // The site remains fully functional when storage is unavailable.
    }
  };

  const textFor = (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;

  const updateMenuLabel = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-label", textFor(menuOpen ? "access.menuClose" : "access.menu"));
    }
  };

  const updateThemeLabel = () => {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    const nextTheme = root.dataset.theme === "dark" ? "Light" : "Dark";
    toggle.setAttribute("aria-label", textFor(`access.theme${nextTheme}`));
  };

  const applyLanguage = (language) => {
    currentLanguage = language === "zh" ? "zh" : "en";
    const dictionary = translations[currentLanguage];
    root.lang = currentLanguage === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (dictionary[key]) element.textContent = dictionary[key];
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      if (dictionary[key]) element.setAttribute("aria-label", dictionary[key]);
    });

    document.querySelectorAll("[data-language-label]").forEach((label) => {
      label.textContent = currentLanguage === "en" ? "中" : "EN";
    });

    document.title = dictionary["meta.title"];
    const metaValues = [
      ["meta[name='description']", "meta.description"],
      ["meta[property='og:title']", "meta.title"],
      ["meta[property='og:description']", "meta.socialDescription"],
      ["meta[name='twitter:title']", "meta.title"],
      ["meta[name='twitter:description']", "meta.socialDescription"]
    ];
    metaValues.forEach(([selector, key]) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute("content", dictionary[key]);
    });

    writeStorage("language", currentLanguage);
    updateMenuLabel();
    updateThemeLabel();
  };

  const initLanguage = () => {
    const stored = readStorage("language");
    applyLanguage(stored === "zh" ? "zh" : "en");
    document.querySelectorAll("[data-language-toggle]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        applyLanguage(currentLanguage === "en" ? "zh" : "en");
        if (toggle.classList.contains("mobile-language")) setMenu(false);
      });
    });
  };

  const initTheme = () => {
    const themeColor = document.querySelector("meta[name='theme-color']");
    const applyThemeColor = () => {
      if (themeColor) themeColor.setAttribute("content", root.dataset.theme === "light" ? "#f3f1e9" : "#07111f");
      updateThemeLabel();
    };

    applyThemeColor();
    document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      writeStorage("theme", root.dataset.theme);
      applyThemeColor();
    });
  };

  const setMenu = (open) => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector(".site-nav");
    menuOpen = Boolean(open);
    toggle?.setAttribute("aria-expanded", String(menuOpen));
    nav?.classList.toggle("is-open", menuOpen);
    document.body.classList.toggle("menu-open", menuOpen);
    updateMenuLabel();
  };

  const initMenu = () => {
    document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => setMenu(!menuOpen));
    document.querySelectorAll(".site-nav a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) setMenu(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 920 && menuOpen) setMenu(false);
    }, { passive: true });
  };

  const initHeader = () => {
    const header = document.querySelector("[data-header]");
    const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    if (!("IntersectionObserver" in window)) return;
    const links = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  };

  const initReveal = () => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    const revealAll = () => elements.forEach((element) => element.classList.add("is-visible"));
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    elements.forEach((element) => observer.observe(element));
    window.setTimeout(revealAll, 1200);
  };

  const initFilters = () => {
    const buttons = Array.from(document.querySelectorAll("[data-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-category]"));
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        cards.forEach((card) => {
          card.hidden = filter !== "all" && card.dataset.category !== filter;
        });
      });
    });
  };

  const initPointerEffects = () => {
    if (prefersReducedMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let point = { x: window.innerWidth * 0.74, y: window.innerHeight * 0.18 };
    document.addEventListener("pointermove", (event) => {
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty("--mouse-x", `${(point.x / window.innerWidth) * 100}%`);
        root.style.setProperty("--mouse-y", `${(point.y / window.innerHeight) * 100}%`);
        frame = 0;
      });
    }, { passive: true });

    const card = document.querySelector("[data-tilt]");
    if (!card) return;
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 5}deg`);
      card.style.setProperty("--tilt-y", `${y * -5}deg`);
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  };

  const init = () => {
    initLanguage();
    initTheme();
    initMenu();
    initHeader();
    initReveal();
    initFilters();
    initPointerEffects();
    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
