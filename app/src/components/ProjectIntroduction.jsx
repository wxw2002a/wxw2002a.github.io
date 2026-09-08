const LinkArrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 16 16 4M5 4h11v11" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export default function ProjectIntroduction({ project, detail, zh, children }) {
  const locale = zh ? "zh" : "en";
  return (
    <div className="project-introduction" data-project-id={project.id}>
      <p className="dialog-summary">{detail.overview[locale]}</p>
      <p className="project-intro-source" data-source-kind={detail.sourceKind}>
        <span>
          {detail.sourceKind === "readme"
            ? zh
              ? "介绍依据 GitHub README · 中文译文"
              : "Introduction from GitHub README"
            : zh
              ? "GitHub 仓库暂无 README · 根据代码整理"
              : "GitHub · No README · written from repository code"}
        </span>
        <a href={detail.sourceUrl} target="_blank" rel="noreferrer">
          {detail.sourceKind === "readme"
            ? "GitHub README"
            : zh
              ? "查看依据"
              : "View evidence"}
          <LinkArrow />
        </a>
      </p>
      <span className="tags" aria-label={zh ? "技术栈" : "Technologies"}>
        {project.tech.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </span>
      {children}
      {detail.sections.map((section, index) => (
        <section
          className="project-intro-section"
          key={section.title.en}
          aria-labelledby={`project-detail-${project.id}-${index}`}
        >
          <h3 id={`project-detail-${project.id}-${index}`}>
            {section.title[locale]}
          </h3>
          <ul>
            {section.bullets[locale].map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ))}
      <div className="project-intro-actions">
        <a
          className="text-link"
          href={project.repo}
          target="_blank"
          rel="noreferrer"
        >
          {zh ? "查看源码" : "View source"}
          <LinkArrow />
        </a>
        {project.demo && (
          <a
            className="text-link"
            href={project.demo}
            target="_blank"
            rel="noreferrer"
          >
            {zh ? "交互演示" : "Interactive demo"}
            <LinkArrow />
          </a>
        )}
      </div>
    </div>
  );
}
