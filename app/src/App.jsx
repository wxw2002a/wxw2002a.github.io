import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getContent } from "./content.js";
import SystemMap from "./components/SystemMap.jsx";

const RESUME_PATH = "/Xiwei-Wang-Resume.pdf";

function ArrowIcon({ down = false }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {down ? (
        <>
          <path d="M10 3v11" />
          <path d="m6 10 4 4 4-4" />
          <path d="M4 17h12" />
        </>
      ) : (
        <>
          <path d="M4 16 16 4" />
          <path d="M7 4h9v9" />
        </>
      )}
    </svg>
  );
}

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }

  return (
    <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 15.2A8.7 8.7 0 0 1 8.8 3.8a8.8 8.8 0 1 0 11.4 11.4Z" />
    </svg>
  );
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function AnimatedMetric({ value, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.55 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : "0");

  useEffect(() => {
    if (!isInView) return undefined;
    const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(numeric) || reduceMotion) {
      setDisplay(value);
      return undefined;
    }

    const negative = value.trim().startsWith("−") || value.trim().startsWith("-");
    const suffix = value.includes("%") ? "%" : value.includes("+") ? "+" : "";
    const startedAt = performance.now();
    const duration = 900;
    let frame = 0;

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numeric * eased);
      setDisplay((negative ? "−" : "") + current + suffix);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, reduceMotion, value]);

  return (
    <div className="proof-item" ref={ref}>
      <strong>{display}</strong>
      <span>{label}</span>
    </div>
  );
}

function Reveal({ as = "div", className = "", children, delay = 0, ...props }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ y: 24, opacity: 0.28 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}

function CapabilityIcon({ type }) {
  if (type === "product-delivery") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 24V8l10-4 10 4v16l-10 4-10-4Z" />
        <path d="m6 8 10 5 10-5M16 13v15" />
      </svg>
    );
  }
  if (type === "full-stack-products") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="4" width="22" height="24" rx="4" />
        <path d="M10 10h12M10 16h7M10 22h10" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="11" />
      <path d="M16 5v22M5 16h22M8 9.5c2.3 2 4.9 3 8 3s5.7-1 8-3M8 22.5c2.3-2 4.9-3 8-3s5.7 1 8 3" />
    </svg>
  );
}

function ProjectVisual({ id }) {
  if (id === "java-tcp-server") {
    return (
      <div className="project-visual-inner">
        <div className="terminal-ui">
          <code>
            $ server --threads=auto
            <br />
            &gt; tuning socket buffers...
            <br />
            &gt; latency <b>~40ms ✓</b>
            <br />
            &gt; status: stable
          </code>
        </div>
      </div>
    );
  }

  if (id === "cuda-convolution") {
    return (
      <div className="project-visual-inner">
        <div className="kernel-grid">
          {Array.from({ length: 64 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (id === "audio-anomaly-detection") {
    return (
      <div className="project-visual-inner">
        <div className="wave-ui">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual-inner">
      <div className="roi-ui">
        <div className="roi-box">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

function Header({
  copy,
  activeSection,
  scrolled,
  menuOpen,
  setMenuOpen,
  isMobile,
  locale,
  onLanguage,
  theme,
  onTheme,
}) {
  const navId = "primary-navigation";
  return (
    <header className={"site-header" + (scrolled ? " is-scrolled" : "")}>
      <div className="nav-shell">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)} aria-label="Xiwei Wang — Home">
          <span className="brand-mark" aria-hidden="true">XW</span>
          <span className="brand-copy">
            <strong>Xiwei Wang</strong>
            <small>{copy.ui.brandRole}</small>
          </span>
        </a>

        <nav
          className={"site-nav" + (menuOpen ? " is-open" : "")}
          id={navId}
          aria-label="Primary navigation"
          hidden={isMobile && !menuOpen}
          inert={isMobile && !menuOpen}
        >
          {copy.ui.nav.map((item) => (
            <a
              key={item.id}
              className={activeSection === item.id ? "is-active" : ""}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="utility-button"
            type="button"
            onClick={onLanguage}
            aria-label={copy.ui.controls.switchLanguage}
          >
            {locale === "en" ? "中" : "EN"}
          </button>
          <button
            className="utility-button"
            type="button"
            onClick={onTheme}
            aria-label={theme === "dark" ? copy.ui.controls.lightTheme : copy.ui.controls.darkTheme}
          >
            <ThemeIcon theme={theme} />
          </button>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls={navId}
            aria-label={menuOpen ? copy.ui.controls.closeMenu : copy.ui.controls.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ copy }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 135]);
  const mapScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
  const reduceMotion = useReducedMotion();

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", ((event.clientX - rect.left) / rect.width) * 100 + "%");
    event.currentTarget.style.setProperty("--pointer-y", ((event.clientY - rect.top) / rect.height) * 100 + "%");
  };

  return (
    <section className="hero" id="home" ref={heroRef} onPointerMove={handlePointerMove}>
      <div className="hero-shell">
        <div className="hero-content">
          <motion.div
            className="hero-copy"
            style={reduceMotion ? undefined : { y: copyY }}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
            }}
          >
            <motion.p
              className="hero-eyebrow"
              variants={{ hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              transition={{ duration: 0.55 }}
            >
              {copy.hero.name} / {copy.hero.eyebrow}
            </motion.p>
            <motion.h1
              variants={{ hidden: { y: 28, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.hero.headlineLead}
              <br />
              <span className="title-accent">{copy.hero.headlineAccent}</span>
            </motion.h1>
            <motion.p
              className="hero-intro"
              variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              transition={{ duration: 0.62 }}
            >
              {copy.hero.lede}
            </motion.p>
            <motion.p
              className="hero-meta"
              variants={{ hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              transition={{ duration: 0.55 }}
            >
              {copy.hero.study}
            </motion.p>
            <motion.div
              className="hero-actions"
              variants={{ hidden: { y: 18, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              transition={{ duration: 0.55 }}
            >
              <motion.a className="button button-primary" href="#experience" whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.98 }}>
                {copy.ui.actions.explore}
                <ArrowIcon />
              </motion.a>
              <motion.a
                className="button button-secondary"
                href={RESUME_PATH}
                download
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
              >
                {copy.ui.actions.downloadResume}
                <ArrowIcon down />
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-map-wrap"
            style={reduceMotion ? undefined : { y: mapY, scale: mapScale }}
            initial={{ opacity: 0, rotate: 1.5 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.85, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <SystemMap />
            <span className="hero-map-caption"><i /> planning → integration → production</span>
          </motion.div>
        </div>

        <div className="proof-rail" aria-label={copy.ui.labels.selectedImpact}>
          {copy.impact.map((item) => (
            <AnimatedMetric key={item.id} value={item.value} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities({ copy }) {
  return (
    <section className="section capability-section" id="profile">
      <div className="section-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">{copy.ui.sectionLabels.profile}</p>
            <h2>{copy.capabilities.title}</h2>
          </div>
          <p>{copy.capabilities.intro}</p>
        </Reveal>

        <div className="capability-grid">
          {copy.capabilities.items.map((item, index) => (
            <Reveal as="article" className="capability-card" delay={index * 0.09} key={item.id}>
              <div className="capability-index">
                <span>{item.index}</span>
                <span>{item.tags.join(" / ")}</span>
              </div>
              <div className="capability-icon"><CapabilityIcon type={item.id} /></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ copy }) {
  return (
    <section className="section experience-section" id="experience">
      <div className="section-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">{copy.ui.sectionLabels.experience}</p>
            <h2>{copy.experienceIntro.title}</h2>
          </div>
          <p>{copy.experienceIntro.text}</p>
        </Reveal>

        <div className="experience-list">
          {copy.experiences.map((role, index) => (
            <Reveal as="article" className="experience-card" key={role.id}>
              <span className="experience-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="experience-meta">
                <time dateTime={role.start}>{role.period}</time>
                <span className="location">{role.location}</span>
                <h3>{role.role}</h3>
                <p className="company">{role.company}</p>
                <div className="experience-highlight">
                  <strong>{role.highlight.value}</strong>
                  <span>{role.highlight.label}</span>
                </div>
              </div>
              <div className="experience-body">
                <ul>
                  {role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                {role.metrics.length > 0 && (
                  <div className="metric-row">
                    {role.metrics.map((metric) => (
                      <span className="metric-chip" key={metric.value + metric.label}>
                        {metric.value} {metric.label}
                      </span>
                    ))}
                  </div>
                )}
                <div className="tag-list">
                  {role.tech.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ copy }) {
  const [filter, setFilter] = useState("all");
  const projects = useMemo(
    () => copy.projects.filter((project) => filter === "all" || project.category === filter),
    [copy.projects, filter],
  );

  useEffect(() => setFilter("all"), [copy.locale]);

  return (
    <section className="section projects-section" id="work">
      <div className="section-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">{copy.ui.sectionLabels.work}</p>
            <h2>{copy.projectsIntro.title}</h2>
          </div>
          <p>{copy.projectsIntro.text}</p>
        </Reveal>

        <div className="filter-bar" role="group" aria-label="Filter projects">
          {copy.ui.projectFilters.map((item) => (
            <button
              className={"filter-button" + (filter === item.id ? " is-active" : "")}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>

        <motion.div className="project-grid" layout>
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.article
                className="project-card"
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -12 }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -7 }}
              >
                <div className="project-visual"><ProjectVisual id={project.id} /></div>
                <div className="project-copy">
                  <div className="project-topline">
                    <span>{project.index} / {project.categoryLabel}</span>
                    <strong>{project.metric}</strong>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-list">
                    {project.tech.map((technology) => <span key={technology}>{technology}</span>)}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Background({ copy }) {
  const spoken = copy.spokenLanguages.map((item) => item.language + " — " + item.level).join(" · ");
  return (
    <section className="section background-section" id="background">
      <div className="section-shell">
        <Reveal className="section-heading">
          <div>
            <p className="section-kicker">{copy.ui.sectionLabels.background}</p>
            <h2>{copy.backgroundIntro.title}</h2>
          </div>
          <p>{copy.backgroundIntro.text}</p>
        </Reveal>

        <div className="background-grid">
          <Reveal className="background-panel">
            <div className="panel-header">
              <span>{copy.ui.labels.education}</span>
              <a className="panel-link" href={RESUME_PATH} target="_blank" rel="noopener noreferrer">
                {copy.ui.actions.viewResume}
                <ArrowIcon />
              </a>
            </div>
            {copy.education.map((school) => (
              <article className="education-item" key={school.id}>
                <time dateTime={school.start}>{school.period}</time>
                <div>
                  <p>{school.school}</p>
                  <h3>{school.degree}</h3>
                  <span>{school.detail}</span>
                </div>
              </article>
            ))}
          </Reveal>

          <Reveal className="background-panel" delay={0.08}>
            <div className="panel-header">
              <span>{copy.ui.labels.technicalToolkit}</span>
              <span>Stack / 2026</span>
            </div>
            {copy.skills.map((group) => (
              <div className="skill-group" key={group.id}>
                <h3>{group.label}</h3>
                <p>{group.items.join(" · ")}</p>
              </div>
            ))}
            <div className="skill-group">
              <h3>{copy.ui.labels.spokenLanguages}</h3>
              <p>{spoken}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Contact({ copy }) {
  return (
    <section className="section contact-section" id="contact">
      <div className="section-shell">
        <Reveal className="contact-card">
          <div>
            <p className="section-kicker">{copy.ui.sectionLabels.contact}</p>
            <h2>{copy.contact.title}</h2>
          </div>
          <div className="contact-bottom">
            <p>{copy.contact.intro}</p>
            <div className="contact-links">
              {copy.contact.links.map((link) => (
                <a
                  className="contact-link"
                  href={link.id === "resume" ? RESUME_PATH : link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  key={link.id}
                >
                  <span><span>{link.label}</span><strong>{link.value}</strong></span>
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function App() {
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem("language") === "zh" ? "zh" : "en";
    } catch {
      return "en";
    }
  });
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const isMobile = useMediaQuery("(max-width: 900px)");
  const copy = getContent(locale);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28, mass: 0.35 });

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen && isMobile);
    const handleKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMobile, menuOpen]);

  useEffect(() => {
    document.documentElement.lang = copy.locale;
    document.title = copy.meta.title;
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    description?.setAttribute("content", copy.meta.description);
    ogTitle?.setAttribute("content", copy.meta.title);
    ogDescription?.setAttribute("content", copy.meta.description);
    twitterTitle?.setAttribute("content", copy.meta.title);
    twitterDescription?.setAttribute("content", copy.meta.description);
    try {
      localStorage.setItem("language", locale);
    } catch {
      // Persistence is optional.
    }
  }, [copy, locale]);

  useEffect(() => {
    const sections = copy.ui.nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -56% 0px", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [copy.ui.nav]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#090d18" : "#f2f0e9");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Persistence is optional.
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">{copy.ui.skipToContent}</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Header
        copy={copy}
        activeSection={activeSection}
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isMobile={isMobile}
        locale={locale}
        onLanguage={() => {
          setLocale((current) => current === "en" ? "zh" : "en");
          setMenuOpen(false);
        }}
        theme={theme}
        onTheme={toggleTheme}
      />

      <main id="main">
        <Hero copy={copy} />
        <Capabilities copy={copy} />
        <Experience copy={copy} />
        <Projects copy={copy} />
        <Background copy={copy} />
        <Contact copy={copy} />
      </main>

      <footer className="site-footer">
        <div className="footer-shell">
          <span>© {new Date().getFullYear()} Xiwei Wang</span>
          <p>{copy.ui.footerNote}</p>
          <nav className="footer-links" aria-label="Footer">
            <a href="mailto:wangxiwei2002@gmail.com">Email</a>
            <a href="https://github.com/wxw2002a" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#home">{copy.ui.actions.backToTop} ↑</a>
          </nav>
        </div>
      </footer>
    </MotionConfig>
  );
}

export default App;
