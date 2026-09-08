import { useState } from "react";
import { githubProjects } from "../githubProjects.js";

const LinkArrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 16 16 4M5 4h11v11" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export default function GithubProjects({ zh, onOpenCase }) {
  const [filter, setFilter] = useState("all");
  const locale = zh ? "zh" : "en";
  const filters = [
    { id: "all", label: zh ? "全部" : "All" },
    { id: "products", label: zh ? "产品应用" : "Products" },
    { id: "tools", label: zh ? "系统与工具" : "Systems & tools" },
    { id: "ipmd", label: "IPMD" },
  ];
  const projects = githubProjects.filter(
    (project) =>
      filter === "all" ||
      (filter === "ipmd"
        ? project.affiliation === "IPMD"
        : project.category === filter),
  );

  return (
    <section
      className="section github-projects-section"
      id="projects"
      aria-labelledby="github-projects-title"
    >
      <div className="section-top reveal">
        <span className="eyebrow">03 / {zh ? "项目" : "PROJECTS"}</span>
        <a
          className="github-profile-link"
          href="https://github.com/wxw2002a?tab=repositories"
          target="_blank"
          rel="noreferrer"
        >
          {zh ? "全部 GitHub 仓库" : "All GitHub repositories"} <LinkArrow />
        </a>
      </div>
      <div className="section-heading reveal">
        <h2 id="github-projects-title">
          {zh ? (
            <>
              从想法，<span>到代码。</span>
            </>
          ) : (
            <>
              Ideas, built.<span>Code, shared.</span>
            </>
          )}
        </h2>
        <p>
          {zh
            ? "精选 GitHub 项目，涵盖产品应用、AI、交互工具与系统实验。IPMD 项目单独标注，点击即可查看源码或相关案例。"
            : "Selected GitHub projects across products, AI, interactive tools, and systems. IPMD work is clearly labelled, with code and case studies to explore."}
        </p>
      </div>
      <div className="github-project-toolbar">
        <div
          className="github-project-filters"
          role="group"
          aria-label={zh ? "GitHub 项目分类" : "GitHub project categories"}
        >
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span
          className="github-project-count"
          aria-live="polite"
          aria-atomic="true"
        >
          {zh ? `${projects.length} 个项目` : `${projects.length} projects`}
        </span>
      </div>
      <div className="github-project-grid">
        {projects.map((project) => (
          <article
            key={project.id}
            className="github-project-card"
            data-project={project.id}
          >
            <div className="github-project-meta">
              <span>{project.label[locale]}</span>
              {project.affiliation && (
                <span className="github-project-affiliation">
                  {project.affiliation}
                </span>
              )}
            </div>
            <h3>{project.title}</h3>
            <span className="github-repo-name">{project.id}</span>
            <p className="github-project-summary">
              {project.description[locale]}
            </p>
            <div
              className="github-project-tech"
              aria-label={zh ? "技术栈" : "Technologies"}
            >
              {project.tech.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            {project.note && (
              <p className="github-project-note">{project.note[locale]}</p>
            )}
            <div className="github-project-actions">
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                aria-label={`${zh ? "查看源码" : "View source"}: ${project.title}`}
              >
                {zh ? "源码" : "Source"} <LinkArrow />
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${zh ? "交互演示" : "Interactive demo"}: ${project.title}`}
                >
                  {zh ? "交互演示" : "Interactive demo"} <LinkArrow />
                </a>
              )}
              {project.caseId && (
                <button
                  type="button"
                  onClick={() => onOpenCase(project.caseId)}
                >
                  {zh ? "查看 IPMD 案例" : "View IPMD case"} <LinkArrow />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <a className="github-archive-link" href="#experiments">
        {zh
          ? "继续查看独立项目与技术实验"
          : "More independent projects & experiments"}{" "}
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
