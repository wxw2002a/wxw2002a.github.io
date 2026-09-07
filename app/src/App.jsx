import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getContent } from "./content.js";
import SculptureScene from "./components/SculptureScene.jsx";
import usePortfolioMotion from "./usePortfolioMotion.js";

const resume = "/Xiwei-Wang-Resume.pdf";
const Arrow = ({ diagonal = false, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"}
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
const Tags = ({ items }) => (
  <span className="tags">
    {items.map((item) => (
      <span key={item}>{item}</span>
    ))}
  </span>
);
const initialLocale = () => {
  try {
    return localStorage.getItem("portfolio-language") === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
};

function ReadingProgress({ zh }) {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        distance > 0
          ? Math.max(0, Math.min(100, (window.scrollY / distance) * 100))
          : 0,
      );
      setScrolled(window.scrollY > 160);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  const percentage = Math.round(progress);
  return (
    <>
      <div
        className="reading-progress"
        role="progressbar"
        aria-label={zh ? "阅读进度" : "Reading progress"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={zh ? `已阅读 ${percentage}%` : `${percentage}% read`}
      >
        <span
          className="reading-progress-fill"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      <a
        className="reading-position"
        href="#profile"
        data-visible={scrolled && percentage < 99}
        tabIndex={scrolled && percentage < 99 ? 0 : -1}
        aria-hidden={!scrolled || percentage >= 99}
        aria-label={
          zh
            ? `已阅读 ${percentage}%，返回顶部`
            : `${percentage}% read, back to top`
        }
      >
        <span>
          {String(percentage).padStart(2, "0")}
          <small>%</small>
        </span>
        <span className="reading-up" aria-hidden="true">
          ↑
        </span>
      </a>
    </>
  );
}

function ProjectVisual({ index, zh }) {
  if (index === 0)
    return (
      <div className="project-visual ai-visual" aria-hidden="true">
        <div className="ai-workbench">
          <div className="ai-toolbar">
            <span className="ai-studio-title">
              <span>✳</span> Image studio
            </span>
            <span className="ai-toolbar-label">
              {zh ? "创意工作台" : "CREATIVE WORKSPACE"}
            </span>
            <span className="ai-window-dots">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="ai-workspace-body">
            <div className="ai-prompt-panel">
              <span className="ai-prompt-label">
                {zh ? "你的想法" : "YOUR PROMPT"}
                <span>01</span>
              </span>
              <p className="ai-prompt-text">
                {zh
                  ? "海边的石灰岩建筑，平静的海面，温暖的午后光线。"
                  : "A quiet coastal pavilion. Warm limestone, still water, afternoon light."}
                <span className="ai-text-caret" />
              </p>
              <div className="ai-options">
                <span>
                  {zh ? "风格" : "Style"}
                  <b>{zh ? "建筑摄影" : "Architecture"}</b>
                </span>
                <span>
                  {zh ? "光线" : "Light"}
                  <b>{zh ? "自然光" : "Natural"}</b>
                </span>
              </div>
              <span className="ai-generate">
                {zh ? "让想法成像" : "Make it visible"}
                <Arrow diagonal />
              </span>
              <span className="ai-pipeline">
                PROMPT <span>→</span> INFERENCE <span>→</span> IMAGE
              </span>
            </div>
            <div className="ai-result-panel">
              <div className="ai-generated-preview">
                <img
                  src="/assets/ai-architecture-preview.jpg"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="ai-draft-layer"
                  style={{
                    backgroundImage:
                      'url("/assets/ai-architecture-preview.jpg")',
                  }}
                />
                <div className="ai-reveal-sweep" />
                <span className="ai-preview-badge">
                  {zh ? "AI 概念预览" : "AI CONCEPT PREVIEW"}
                </span>
                <span className="ai-preview-expand">
                  <Arrow diagonal />
                </span>
              </div>
              <div className="ai-result-footer">
                <span>
                  <i className="signal-dot" />
                  {zh ? "从文字，到画面。" : "From a few words, a new world."}
                </span>
                <span>01 / 01</span>
              </div>
            </div>
          </div>
        </div>
        <span className="visual-note">
          CONCEPT UI · NOT A PRODUCT SCREENSHOT
        </span>
      </div>
    );
  if (index === 1)
    return (
      <div className="project-visual warehouse-visual" aria-hidden="true">
        <div className="art-caption">
          <span>WAREHOUSE / LIVE STATE</span>
          <span>
            <i className="signal-dot" /> SYNC
          </span>
        </div>
        <svg className="warehouse-grid" viewBox="0 0 560 300">
          <g transform="translate(280 15) rotate(30) skewX(-30) scale(1 .85)">
            {Array.from({ length: 160 }, (_, i) => {
              const x = (i % 16) * 20 - 180;
              const y = Math.floor(i / 16) * 24;
              const active = (i * 7) % 19 < 4;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width="13"
                  height="16"
                  rx="1"
                  fill={active ? "#d9fa8a" : "#27342b"}
                  opacity={active ? 0.4 + (i % 6) / 10 : 1}
                  className={active ? "live-cell" : ""}
                  style={{ animationDelay: `${(i % 7) * -0.7}s` }}
                />
              );
            })}
            <path
              d="M-186 262H143V-12H-55V262"
              stroke="#d9fa8a"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 6"
              className="data-route"
            />
            <circle className="warehouse-agv" r="5" fill="#e6ff7b" />
            <circle className="warehouse-agv agv-second" r="3" fill="#e6ff7b" />
          </g>
        </svg>
        <div className="visual-stat">
          <b>
            &lt;80<span>ms</span>
          </b>
          <span>REAL-TIME SYNC LATENCY</span>
        </div>
        <span className="visual-note">CONCEPT VISUAL / NOT PRODUCT UI</span>
      </div>
    );
  return (
    <div className="project-visual vision-visual" aria-hidden="true">
      <div className="art-caption">
        <span>VISION / FRAME ANALYSIS</span>
        <span>03 / INSPECTION</span>
      </div>
      <div className="vision-target">
        <div className="target-ring" />
        <div className="target-ring" />
        <div className="target-cross" />
        <div className="scan-line" />
        <span>
          600<small>IMAGES / SECOND · PEAK</small>
        </span>
      </div>
      <div className="vision-coordinates">
        <span>ROI [ 0.24, 0.68 ]</span>
        <span>C++ / QT / LINUX</span>
      </div>
      <div className="vision-waveform">
        {[0.4, 0.8, 0.55, 1, 0.65, 0.3, 0.85, 0.5, 0.9, 0.35, 0.65, 0.45].map(
          (height, index) => (
            <i
              key={index}
              style={{
                "--bar-height": height,
                "--bar-delay": `${index * -0.16}s`,
              }}
            />
          ),
        )}
      </div>
      <span className="visual-note">CONCEPT VISUAL / NOT PRODUCT UI</span>
    </div>
  );
}

function CaseVideo({ video, zh }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const player = ref.current;
    if (player.getAttribute("src") !== video.src) {
      player.setAttribute("src", video.src);
    }
    setFailed(false);
    return () => {
      player.pause();
      player.removeAttribute("src");
      player.load();
    };
  }, [video.src]);

  return (
    <figure className="case-video-block">
      <video
        ref={ref}
        className="case-video"
        src={video.src}
        poster={video.poster}
        controls
        playsInline
        preload="metadata"
        width="1280"
        height="720"
        aria-label={video.title}
        onPlay={(event) => {
          document.querySelectorAll(".case-video").forEach((player) => {
            if (player !== event.currentTarget) player.pause();
          });
        }}
        onError={() => setFailed(true)}
      />
      <figcaption>
        <span>{video.title}</span>
        <a href={video.src} target="_blank" rel="noreferrer">
          {zh ? "单独打开视频" : "Open video"}
          <Arrow diagonal />
        </a>
      </figcaption>
      {failed && (
        <p className="case-video-error" role="status">
          {zh
            ? "视频暂时无法播放，请尝试单独打开视频。"
            : "Unable to play here. Try opening the video directly."}
        </p>
      )}
    </figure>
  );
}

function CaseVideoGallery({ videos, zh }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const video = videos[activeIndex];

  return (
    <section
      className="case-video-gallery"
      aria-label={zh ? "项目视频" : "Project videos"}
    >
      <div className="case-video-heading">
        <span>{zh ? "视频演示" : "VIDEO DEMOS"}</span>
        <span>
          0{activeIndex + 1} / 0{videos.length}
        </span>
      </div>
      <div
        className="case-video-options"
        role="group"
        aria-label={zh ? "选择视频" : "Select video"}
      >
        {videos.map((item, index) => (
          <button
            key={item.src}
            type="button"
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <CaseVideo key={video.src} video={video} zh={zh} />
    </section>
  );
}

function CaseDialog({ selected, data, onClose, zh }) {
  const ref = useRef(null);
  const featured = data.featured.find((item) => item.id === selected);
  const role = data.experiences.find(
    (item) => item.id === featured?.experienceId,
  );
  useEffect(() => {
    const dialog = ref.current;
    if (selected && !dialog.open) {
      document
        .querySelectorAll(".case-video")
        .forEach((player) => player.pause());
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!selected && dialog.open) dialog.close();
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);
  return (
    <dialog
      ref={ref}
      className="case-dialog"
      aria-labelledby="case-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current.close();
      }}
    >
      {featured && (
        <div className="dialog-content">
          <button
            className="dialog-close"
            onClick={() => ref.current.close()}
            aria-label={zh ? "关闭案例" : "Close case study"}
          >
            ×
          </button>
          <span className="eyebrow">{featured.eyebrow}</span>
          <h2 id="case-title">{featured.title}</h2>
          {featured.videos && (
            <CaseVideoGallery
              key={featured.id}
              videos={featured.videos}
              zh={zh}
            />
          )}
          {featured.video && (
            <CaseVideo key={featured.id} video={featured.video} zh={zh} />
          )}
          <p className="dialog-summary">{featured.summary}</p>
          <div className="dialog-role">
            <span>{role.company}</span>
            <span>{role.role}</span>
            <span>{role.period}</span>
          </div>
          <h3>{zh ? "我的工作" : "My contribution"}</h3>
          <ul>
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <Tags items={featured.tech} />
          <a
            className="text-link"
            href={resume}
            target="_blank"
            rel="noreferrer"
          >
            {data.ui.actions.viewResume}
            <Arrow diagonal />
          </a>
        </div>
      )}
    </dialog>
  );
}

export default function App() {
  const [locale, setLocale] = useState(initialLocale);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openVideoExperience, setOpenVideoExperience] = useState(null);
  const [filter, setFilter] = useState("all");
  const [touchInput, setTouchInput] = useState(
    () => window.matchMedia("(pointer: coarse)").matches,
  );
  const reducedMotion = useReducedMotion();
  const data = getContent(locale);
  const zh = locale === "zh";
  const motionOff = paused || reducedMotion;
  usePortfolioMotion({ disabled: !!motionOff, locale });

  useEffect(() => {
    document.documentElement.lang = data.locale;
    document.title = data.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", data.meta.description);
    try {
      localStorage.setItem("portfolio-language", locale);
    } catch {
      /* Storage may be disabled. */
    }
  }, [data, locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#09090b" : "#efeee8");
    try {
      localStorage.setItem("portfolio-appearance", theme);
    } catch {
      /* Keep the in-memory preference. */
    }
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.motion = motionOff ? "paused" : "running";
  }, [motionOff]);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setTouchInput(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [locale]);
  useEffect(() => {
    let cancelled = false;
    const followHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id)
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    };
    document.fonts.ready.then(() => {
      if (!cancelled) requestAnimationFrame(followHash);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  const nav = [
    { id: "work", label: zh ? "作品" : "Work" },
    { id: "experience", label: zh ? "经历" : "Experience" },
    { id: "background", label: zh ? "关于" : "About" },
  ];
  return (
    <>
      <ReadingProgress zh={zh} />
      <a className="skip-link" href="#main">
        {data.ui.skipToContent}
      </a>
      <header className="nav">
        <a className="wordmark" href="#profile" aria-label="Xiwei Wang — home">
          xw<span className="wordmark-star">✳</span>
        </a>
        <span className="nav-descriptor">
          {zh ? "软件工程师 / 创造者" : "SOFTWARE ENGINEER / BUILDER"}
        </span>
        <nav
          id="site-navigation"
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label={zh ? "主导航" : "Main navigation"}
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            {zh ? "联系" : "Let’s talk"}
            <Arrow diagonal />
          </a>
        </nav>
        <div className="nav-controls">
          <button
            className="language-button"
            aria-label={data.ui.controls.switchLanguage}
            onClick={() => setLocale(zh ? "en" : "zh")}
          >
            {zh ? "EN" : "中"}
          </button>
          <button
            className="theme-button"
            aria-label={
              theme === "dark"
                ? data.ui.controls.lightTheme
                : data.ui.controls.darkTheme
            }
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" />
              <path d="M10 4a6 6 0 0 1 0 12z" fill="currentColor" />
            </svg>
          </button>
          <button
            className="menu-button"
            aria-controls="site-navigation"
            aria-expanded={menuOpen}
            aria-label={
              menuOpen ? data.ui.controls.closeMenu : data.ui.controls.openMenu
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main id="main">
        <section id="profile" className="hero" aria-labelledby="hero-name">
          <div className="hero-topline">
            <span>
              <i className="signal-dot" />{" "}
              {zh ? "加拿大 · 安大略" : "ONTARIO, CANADA"}
            </span>
            <span>
              {zh
                ? "界面 / 智能 / 系统"
                : "INTERFACES / INTELLIGENCE / SYSTEMS"}
            </span>
          </div>
          <h1 id="hero-name" aria-label="Xiwei Wang">
            {Array.from("XIWEI WANG").map((letter, index) => (
              <span className="hero-letter-mask" key={index} aria-hidden="true">
                <span
                  className="hero-letter"
                  style={{ "--letter-index": index }}
                >
                  {letter === " " ? "\u00a0" : letter}
                </span>
              </span>
            ))}
            <span className="name-period" aria-hidden="true">
              ✳
            </span>
          </h1>
          <div className="hero-scene">
            <SculptureScene
              paused={paused}
              reducedMotion={!!reducedMotion}
              exploded={exploded}
            />
          </div>
          <div className="hero-copy">
            <p className="hero-statement">
              {zh ? (
                <>
                  从想法，
                  <br />
                  到真实运行的系统。
                </>
              ) : (
                <>
                  Good ideas.
                  <br />
                  Engineered into reality.
                </>
              )}
            </p>
            <p className="hero-description">
              {zh
                ? "我是 Xiwei，一名软件工程师。构建全栈产品、AI 平台与实时系统。"
                : "I’m Xiwei, a software engineer building full-stack products, AI platforms, and real-time systems."}
            </p>
            <div className="hero-actions">
              <a className="pill-button" href="#work" data-magnetic>
                {zh ? "探索作品" : "Explore my work"}
                <Arrow diagonal />
              </a>
              <a
                className="resume-link"
                href={resume}
                target="_blank"
                rel="noreferrer"
              >
                {zh ? "简历" : "Résumé"}
                <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="scene-label">
            <span className="cross-mark">+</span>
            <span>
              {zh ? "形态研究 001" : "FORM STUDY 001"}
              <small>
                {motionOff
                  ? zh
                    ? "静态形态 · 动效已暂停"
                    : "STILL FORM · MOTION PAUSED"
                  : touchInput
                    ? zh
                      ? "动态 3D · 向下探索"
                      : "LIVE 3D · SCROLL TO EXPLORE"
                    : zh
                      ? "交互式 3D · 拖动探索"
                      : "INTERACTIVE 3D · DRAG TO EXPLORE"}
              </small>
            </span>
          </div>
          <button
            className="cube-control"
            aria-pressed={exploded}
            aria-label={
              exploded
                ? zh
                  ? "组装方块"
                  : "Assemble cube"
                : zh
                  ? "拆解方块"
                  : "Explode cube"
            }
            onClick={() => setExploded(!exploded)}
            data-magnetic
          >
            <span
              className={
                exploded ? "cube-control-icon is-exploded" : "cube-control-icon"
              }
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              {exploded ? (zh ? "组装" : "ASSEMBLE") : zh ? "拆解" : "EXPLODE"}
            </span>
          </button>
          <button
            className="motion-button hero-motion"
            aria-label={
              motionOff
                ? zh
                  ? "开启动效"
                  : "Resume motion"
                : zh
                  ? "暂停动效"
                  : "Pause motion"
            }
            aria-pressed={!!motionOff}
            disabled={!!reducedMotion}
            onClick={() => setPaused(!paused)}
          >
            <span>{motionOff ? "▷" : "Ⅱ"}</span>
            {reducedMotion
              ? zh
                ? "已减少动态"
                : "REDUCED MOTION"
              : motionOff
                ? zh
                  ? "开启动效"
                  : "RESUME MOTION"
                : zh
                  ? "暂停动效"
                  : "PAUSE MOTION"}
          </button>
          <div className="hero-bottom">
            <a href="#work" className="scroll-link">
              <span>↓</span>
              {zh ? "向下探索" : "SCROLL TO DISCOVER"}
            </a>
            <span className="hero-study">
              WATERLOO MENG <span>/</span> SOFTWARE ENGINEERING
            </span>
            <span className="bottom-edition">PORTFOLIO / 2026</span>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div>
            {Array.from({ length: 2 }, (_, i) => (
              <span key={i}>
                FULL-STACK ENGINEERING <i>✳</i> AI EXPERIENCES <i>✳</i>{" "}
                REAL-TIME SYSTEMS <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>

        <section
          className="section work-section"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-top reveal">
            <span className="eyebrow">
              01 / {zh ? "精选作品" : "SELECTED WORK"}
            </span>
            <span className="section-note">2024 — 2026</span>
          </div>
          <div className="section-heading reveal">
            <h2 id="work-title">
              {zh ? (
                <>
                  从构想到<span>交付。</span>
                </>
              ) : (
                <>
                  Built to<span>come alive.</span>
                </>
              )}
            </h2>
            <p>
              {zh
                ? "从生成式 AI 到工业视觉。把复杂的系统，变成可用的产品。"
                : "From generative AI to industrial vision. Turning complex systems into things people can use."}
            </p>
          </div>
          <div className="case-grid">
            {data.featured.map((item, index) => (
              <article
                key={item.id}
                className={`case-study case-${index} reveal`}
                style={{ "--reveal-delay": `${index * 0.09}s` }}
              >
                <ProjectVisual index={index} zh={zh} />
                <div className="case-info">
                  <span className="eyebrow">{item.eyebrow}</span>
                  <div className="case-title-row">
                    <h3>{item.title}</h3>
                    <span className="circle-arrow">
                      <Arrow diagonal />
                    </span>
                  </div>
                  <p>{item.summary}</p>
                  <Tags items={item.tech.slice(0, 4)} />
                </div>
                <button
                  className="case-open"
                  onClick={() => setSelected(item.id)}
                  aria-label={`${zh ? "查看案例" : "View case study"}: ${item.title}`}
                />
              </article>
            ))}
          </div>
        </section>

        <section
          className="section experience-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="section-top reveal">
            <span className="eyebrow">
              02 / {zh ? "职业经历" : "THE JOURNEY"}
            </span>
            <a
              className="text-link"
              href={resume}
              target="_blank"
              rel="noreferrer"
            >
              {data.ui.actions.viewResume}
              <Arrow diagonal />
            </a>
          </div>
          <div className="section-heading reveal">
            <h2 id="experience-title">
              {zh ? (
                <>
                  在实践中<span>不断构建。</span>
                </>
              ) : (
                <>
                  Always learning.<span>Always building.</span>
                </>
              )}
            </h2>
            <p>
              {zh
                ? "五段经历，一条贯穿前端、后端、AI 与工业系统的工程路径。"
                : "Five roles. One continuous thread of building across the stack."}
            </p>
          </div>
          <div className="experience-list reveal">
            {data.experiences.map((item, index) => (
              <details
                key={item.id}
                className="experience-row"
                data-experience-id={item.id}
                onToggle={
                  item.videos
                    ? (event) => {
                        setOpenVideoExperience(
                          event.currentTarget.open ? item.id : null,
                        );
                      }
                    : undefined
                }
              >
                <summary>
                  <span className="row-index">0{index + 1}</span>
                  <span className="role-main">
                    <span className="company">
                      {item.id === "hit-robotics"
                        ? zh
                          ? "哈工大机器人研究院"
                          : "HIT Robotics Institute"
                        : item.company}
                    </span>
                    <span className="role-title">{item.role}</span>
                  </span>
                  <span className="role-meta">
                    <span>{item.period}</span>
                    <span>{item.location}</span>
                  </span>
                  <span className="expand-icon">+</span>
                </summary>
                <div className="role-details">
                  <div className="role-impact">
                    <b>{item.highlight.value}</b>
                    <span>{item.highlight.label}</span>
                  </div>
                  <div>
                    <ul>
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <Tags items={item.tech} />
                    {item.videos && openVideoExperience === item.id && (
                      <div className="experience-videos">
                        <CaseVideoGallery videos={item.videos} zh={zh} />
                      </div>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section
          id="experiments"
          className="section experiments-section"
          aria-labelledby="experiments-title"
        >
          <div className="section-top reveal">
            <span className="eyebrow">
              03 / {zh ? "自主探索" : "OFF THE CLOCK"}
            </span>
            <span className="section-note">
              {zh ? "独立项目与技术实验" : "SIDE PROJECTS & EXPERIMENTS"}
            </span>
          </div>
          <div className="section-heading reveal">
            <h2 id="experiments-title">
              {zh ? (
                <>
                  保持<span>好奇。</span>
                </>
              ) : (
                <>
                  Curiosity,<span>in code.</span>
                </>
              )}
            </h2>
            <div
              className="filters"
              aria-label={zh ? "项目分类" : "Project filters"}
            >
              {data.ui.projectFilters.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="project-list">
            {data.projects
              .filter((item) => filter === "all" || item.category === filter)
              .map((item) => (
                <details className="project-row" key={item.id}>
                  <summary>
                    <span
                      className={`project-glyph glyph-${item.category}`}
                      aria-hidden="true"
                    >
                      {item.category === "gpu"
                        ? "▦"
                        : item.category === "ai"
                          ? "≋"
                          : "⌘"}
                    </span>
                    <span className="project-row-title">
                      <span className="eyebrow">{item.categoryLabel}</span>
                      <strong className="project-name">{item.title}</strong>
                    </span>
                    <span className="project-metric">{item.metric}</span>
                    <span className="expand-icon">+</span>
                  </summary>
                  <div className="project-description">
                    <p>{item.description}</p>
                    <Tags items={item.tech} />
                  </div>
                </details>
              ))}
          </div>
        </section>

        <section
          className="section about-section"
          id="background"
          aria-labelledby="about-title"
        >
          <div className="section-top reveal">
            <span className="eyebrow">
              04 / {zh ? "关于我" : "BEHIND THE WORK"}
            </span>
            <span className="section-note">
              {zh
                ? "工程思维，持续探索。"
                : "AN ENGINEER’S MIND. A BUILDER’S INSTINCT."}
            </span>
          </div>
          <div className="about-grid">
            <div className="about-intro reveal">
              <h2 id="about-title">
                {zh ? (
                  <>
                    理解细节。
                    <br />
                    <em>连接全局。</em>
                  </>
                ) : (
                  <>
                    Think deeply.
                    <br />
                    <em>Build broadly.</em>
                  </>
                )}
              </h2>
              <p>{data.hero.lede}</p>
              <p>
                {zh
                  ? "目前在滑铁卢大学攻读电气与计算机工程硕士，专注软件工程。电子科学背景，让我习惯跨越软件与真实世界的边界。"
                  : "At the University of Waterloo, I’m pursuing an MEng in Electrical & Computer Engineering, focused on Software Engineering. An electronics background keeps me curious about where software meets the real world."}
              </p>
              <a
                className="text-link"
                href={data.contact.githubHref}
                target="_blank"
                rel="noreferrer"
              >
                {zh ? "在 GitHub 上继续了解" : "More on GitHub"}
                <Arrow diagonal />
              </a>
            </div>
            <div className="education-list reveal">
              <h3 className="eyebrow">{data.ui.labels.education}</h3>
              {data.education.map((item) => (
                <div className="education-item" key={item.id}>
                  <span className="education-year">{item.period}</span>
                  <h3>{item.school}</h3>
                  <p>{item.degree}</p>
                  <span>{item.detail}</span>
                </div>
              ))}
              <div className="spoken-languages">
                {data.spokenLanguages.map((item) => (
                  <span key={item.id}>
                    {item.language}
                    <small>{item.level}</small>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="toolkit reveal">
            <h3 className="eyebrow">{data.ui.labels.technicalToolkit}</h3>
            <div className="skill-grid">
              {data.skills.map((item) => (
                <div className="skill-group" key={item.id}>
                  <h4>{item.label}</h4>
                  <p>{item.items.join(" / ")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="contact-section section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-top">
            <span className="eyebrow">
              05 / {zh ? "下一个想法" : "THE NEXT GOOD IDEA"}
            </span>
            <span className="contact-spark" aria-hidden="true">
              ✳
            </span>
          </div>
          <a className="contact-heading" href={data.contact.emailHref}>
            <h2 id="contact-title">
              {zh ? (
                <>
                  一起创造<span>下一步。</span>
                </>
              ) : (
                <>
                  Let’s make<span>it happen.</span>
                </>
              )}
            </h2>
            <Arrow diagonal />
          </a>
          <div className="contact-bottom">
            <a href={data.contact.emailHref}>{data.contact.email}</a>
            <div>
              <a
                href={data.contact.githubHref}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
                <Arrow diagonal />
              </a>
              <a href={resume} target="_blank" rel="noreferrer">
                {zh ? "简历" : "Résumé"}
                <Arrow diagonal />
              </a>
              <a href={data.contact.phoneHref}>{data.contact.phone}</a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#profile">
          xw<span className="wordmark-star">✳</span>
        </a>
        <span>© {new Date().getFullYear()} XIWEI WANG</span>
        <a className="back-top" href="#profile">
          {data.ui.actions.backToTop} ↑
        </a>
      </footer>
      <CaseDialog
        selected={selected}
        data={data}
        zh={zh}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
