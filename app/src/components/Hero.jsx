import SculptureScene from "./SculptureScene.jsx";

const Arrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 16 16 4M5 4h11v11" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export default function Hero({
  zh,
  paused,
  reducedMotion,
  exploded,
  touchInput,
  resume,
  onToggleExploded,
  onToggleMotion,
}) {
  const motionOff = paused || reducedMotion;
  return (
    <section
      id="profile"
      className="hero hero-editorial"
      aria-labelledby="hero-name"
    >
      <div className="hero-topline">
        <span>
          <i className="signal-dot" />{" "}
          {zh ? "加拿大 · 安大略" : "ONTARIO, CANADA"}
        </span>
        <span>
          {zh ? "全栈 / AI / 实时系统" : "FULL-STACK / AI / REAL-TIME SYSTEMS"}
        </span>
      </div>
      <div className="hero-composition">
        <div className="hero-copy">
          <div className="hero-identity">
            <h1 id="hero-name" aria-label="Xiwei Wang">
              {Array.from("XIWEI WANG").map((letter, index) => (
                <span
                  className="hero-letter-mask"
                  key={index}
                  aria-hidden="true"
                >
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
            <span className="hero-role">
              {zh ? "软件工程师" : "SOFTWARE ENGINEER"}
            </span>
          </div>
          <blockquote className="hero-philosophy">
            {zh ? (
              <>
                <span>“好的工程，</span>
                <span>是在约束条件下</span>
                <span className="hero-quote-accent">解决问题。”</span>
              </>
            ) : (
              <>
                <span>“Good engineering</span> <span>is problem-solving</span>{" "}
                <span className="hero-quote-accent">with constraints.”</span>
              </>
            )}
          </blockquote>
          <p className="hero-description">
            {zh
              ? "这句话塑造了我的学习与构建方式：保持好奇，快速拆解问题，并掌握任务所需的任何工具。"
              : "That idea has shaped how I learn and build: stay curious, break problems down quickly, and pick up whatever tools the job demands."}
          </p>
          <div className="hero-actions">
            <a className="pill-button" href="#work" data-magnetic>
              {zh ? "探索作品" : "Explore my work"}
              <Arrow />
            </a>
            <a
              className="resume-link"
              href={resume}
              target="_blank"
              rel="noreferrer"
            >
              {zh ? "简历" : "Résumé"}
              <Arrow />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-heading">
            <span>{zh ? "交互形态研究" : "INTERACTIVE STUDY"}</span>
            <span>001</span>
          </div>
          <div className="hero-scene">
            <SculptureScene
              paused={paused}
              reducedMotion={reducedMotion}
              exploded={exploded}
            />
          </div>
          <div className="hero-visual-footer">
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
              onClick={onToggleExploded}
              data-magnetic
            >
              <span
                className={
                  exploded
                    ? "cube-control-icon is-exploded"
                    : "cube-control-icon"
                }
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                <i />
              </span>
              <span>
                {exploded
                  ? zh
                    ? "组装"
                    : "ASSEMBLE"
                  : zh
                    ? "拆解"
                    : "EXPLODE"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#projects" className="scroll-link">
          <span>↓</span>
          {zh ? "探索项目" : "EXPLORE PROJECTS"}
        </a>
        <span className="hero-study">
          WATERLOO MENG <span>/</span> SOFTWARE ENGINEERING
        </span>
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
          onClick={onToggleMotion}
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
      </div>
    </section>
  );
}
