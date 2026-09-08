const LinkArrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 16 16 4M5 4h11v11" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export default function ProjectImageGallery({ images, zh }) {
  if (!images?.length) return null;
  const locale = zh ? "zh" : "en";
  return (
    <section
      className="project-image-gallery"
      aria-label={zh ? "项目截图" : "Project screenshots"}
    >
      <div className="project-image-heading">
        <h3>{zh ? "项目截图" : "Project screenshots"}</h3>
        <span>GITHUB README · {images.length}</span>
      </div>
      {images.map((item) => (
        <figure className="project-image" key={item.src}>
          <a
            className="project-image-link"
            href={item.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`${zh ? "查看完整图片" : "View full-size image"}: ${item.alt[locale]}`}
          >
            <img
              src={item.src}
              width={item.width}
              height={item.height}
              alt={item.alt[locale]}
              loading="lazy"
              decoding="async"
            />
          </a>
          <figcaption>
            <p>{item.caption[locale]}</p>
            <div className="project-image-actions">
              <a href={item.src} target="_blank" rel="noreferrer">
                {zh ? "打开原图" : "Open original"}
                <LinkArrow />
              </a>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                {zh ? "GitHub 来源" : "GitHub source"}
                <LinkArrow />
              </a>
            </div>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
