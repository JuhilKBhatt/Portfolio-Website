// ./client/src/components/ProjectCard.jsx

import PropTypes from "prop-types";
import { Carousel, Image, Tooltip } from "antd";
import {
  GlobalOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { useMemo, useState, useRef, useEffect } from "react";
import "../styles/projectCard.css";

function optimizeImageUrl(url, width = 800) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("/upload/f_auto") && !url.includes("/upload/q_auto")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
  }
  return url;
}

function ProjectPlaceholder({ title }) {
  return (
    <div className="project-placeholder">
      <div className="project-placeholder-pattern" />
      <div className="project-placeholder-content">
        <CodeOutlined className="project-placeholder-icon" />
        <span className="project-placeholder-title">{title || "Project Preview"}</span>
      </div>
    </div>
  );
}

ProjectPlaceholder.propTypes = {
  title: PropTypes.string,
};

function isSafeUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProjectCard({ project, index }) {
  const info = project?.portfolio_info;
  const isVisible = Boolean(info && info.Visibilty === true);
  const [imageFailed, setImageFailed] = useState(false);
  const cardRef = useRef(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setHasEnteredViewport(true);
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredViewport(true);
          setIsInViewport(true);
        } else {
          setIsInViewport(false);
        }
      },
      { rootMargin: "300px 0px" } // Pre-load media 300px before appearing in viewport
    );

    const el = cardRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const filteredImages = useMemo(() => {
    return isVisible ? (info?.images || []).filter(Boolean) : [];
  }, [isVisible, info?.images]);

  // Derived top-left badge tag: shows category instead of repo name (e.g. "01 // FULL STACK")
  const topTag = useMemo(() => {
    const prefix =
      index != null
        ? `${String(index + 1).padStart(2, "0")} // `
        : project?.id
        ? `PROJ-${project.id} // `
        : "";
    const category = (
      info?.category ||
      info?.type ||
      "General"
    ).toUpperCase();
    return `${prefix}${category}`;
  }, [index, project?.id, info?.category, info?.type]);

  // Status badge on media overlay: e.g. "• vProd", "• vBeta", "• vAlpha"
  const rawStatus = info?.version || "Prod";
  const badgeKey = String(rawStatus).toLowerCase().trim();
  const statusBadge = rawStatus
    ? String(rawStatus).toLowerCase().startsWith("v")
      ? rawStatus
      : `v${rawStatus}`
    : null;

  // Version pill in title row: e.g. "v2.4", "v1.0.0"
  const versionPill = useMemo(() => {
    const raw = info?.versionNumber;
    if (!raw) return null;
    return String(raw).startsWith("v") ? raw : `v${raw}`;
  }, [info?.versionNumber]);

  // Aggregated tech tags with category classification
  const allTags = useMemo(() => {
    if (info?.techStack && typeof info.techStack === "object") {
      const items = [];
      for (const [category, list] of Object.entries(info.techStack)) {
        if (Array.isArray(list)) {
          const catLower = category.toLowerCase();
          let categoryClass = "";
          if (catLower.includes("ai")) categoryClass = "tag-ai";
          else if (catLower.includes("devsecops") || catLower.includes("cloud")) categoryClass = "tag-devsecops";
          else if (catLower.includes("backend")) categoryClass = "tag-backend";
          else if (catLower.includes("frontend")) categoryClass = "tag-frontend";
          else if (catLower.includes("test")) categoryClass = "tag-test";

          for (const item of list) {
            if (item && typeof item === "string" && item.trim()) {
              items.push({ name: item.trim(), categoryClass });
            }
          }
        }
      }
      return items;
    }

    if (Array.isArray(info?.language)) {
      return info.language
        .filter((item) => item && typeof item === "string" && item.trim())
        .map((item) => ({ name: item.trim(), categoryClass: "" }));
    }

    return [];
  }, [info?.techStack, info?.language]);

  const mediaContent = useMemo(() => {
    if (imageFailed || filteredImages.length === 0) {
      return <ProjectPlaceholder title={info?.title || project?.name} />;
    }

    // Lazy rendering: if offscreen and hasn't entered viewport yet, render lightweight native image
    // without initializing the heavy Ant Design Carousel / slick-slider timers
    if (!hasEnteredViewport) {
      return (
        <img
          alt={`${info?.title || project?.name} Cover Preview`}
          src={optimizeImageUrl(filteredImages[0], 800)}
          className="project-image"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      );
    }

    if (filteredImages.length > 1) {
      return (
        <Image.PreviewGroup>
          <Carousel
            autoplay={isInViewport}
            dots
            lazyLoad="ondemand"
            className="project-carousel"
          >
            {filteredImages.map((url, i) => (
              <div key={url || i} className="project-carousel-slide">
                <Image
                  src={optimizeImageUrl(url, 800)}
                  preview={{ src: optimizeImageUrl(url, 2560) }}
                  alt={`${info?.title || project?.name} Screenshot ${i + 1}`}
                  className="project-image"
                  loading="lazy"
                  decoding="async"
                  onError={() => setImageFailed(true)}
                />
              </div>
            ))}
          </Carousel>
        </Image.PreviewGroup>
      );
    }

    return (
      <Image
        alt={`${info?.title || project?.name} Cover`}
        src={optimizeImageUrl(filteredImages[0], 800)}
        preview={{ src: optimizeImageUrl(filteredImages[0], 2560) }}
        className="project-image"
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
      />
    );
  }, [imageFailed, filteredImages, hasEnteredViewport, isInViewport, info?.title, project?.name]);

  if (!isVisible) return null;

  return (
    <article ref={cardRef} className="project-card">
      {/* 1. Media Preview on Top with Overlaid Badges */}
      <div className="project-card-media">
        {mediaContent}
        <div className="project-card-media-overlay">
          <span className="project-card-repo-tag" title={topTag}>
            {topTag}
          </span>
          {statusBadge && (
            <span
              className={`project-card-status-pill status-${badgeKey}`.trim()}
              title={`Status: ${statusBadge}`}
            >
              <span className="status-dot">●</span>
              <span>{statusBadge}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Main Card Body Content */}
      <div className="project-card-body">
        {/* Title Row with Version Pill */}
        <div className="project-card-title-row">
          <h2 className="project-card-title">{info?.title || project?.name}</h2>
          {versionPill && (
            <span className="project-card-version-pill">{versionPill}</span>
          )}
        </div>

        {/* Description Paragraph */}
        {(info?.description || project?.description) && (
          <p className="project-card-description">
            {info?.description || project?.description}
          </p>
        )}

        {/* Engineered Highlights */}
        {Array.isArray(info?.Highlights) && info.Highlights.length > 0 && (
          <div className="project-card-highlights">
            <div className="project-card-highlights-header">
              <FolderOpenOutlined className="highlights-icon" />
              <span>ENGINEERED HIGHLIGHTS</span>
            </div>
            <ul className="project-card-highlights-list">
              {info.Highlights.map((highlight, idx) => (
                <li key={idx} className="project-card-highlight-item">
                  <span className="highlight-chevron">&gt;</span>
                  <span className="highlight-text">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Pills */}
        {allTags.length > 0 && (
          <div className="project-card-tags">
            {allTags.map((tagItem, idx) => (
              <span
                key={`${tagItem.name}-${idx}`}
                className={`project-tech-pill ${tagItem.categoryClass}`.trim()}
              >
                {tagItem.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Action Footer Links */}
      <div className="project-card-footer">
        {isSafeUrl(info?.liveDemo) ? (
          <Tooltip title="Visit Live Website">
            <a
              href={info.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-action"
            >
              <GlobalOutlined className="action-icon" />
              <span>Live Website</span>
            </a>
          </Tooltip>
        ) : (
          <Tooltip title="No Live Website available">
            <span className="project-card-action is-disabled">
              <GlobalOutlined className="action-icon" />
              <span>Live Website</span>
            </span>
          </Tooltip>
        )}

        {isSafeUrl(project?.html_url) ? (
          <Tooltip title="View Source Code on GitHub">
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-action"
            >
              <CodeOutlined className="action-icon" />
              <span>Source Code</span>
            </a>
          </Tooltip>
        ) : (
          <Tooltip title="No Source Code available">
            <span className="project-card-action is-disabled">
              <CodeOutlined className="action-icon" />
              <span>Source Code</span>
            </span>
          </Tooltip>
        )}

        {isSafeUrl(info?.videoDemo) ? (
          <Tooltip title="Watch Video Demo">
            <a
              href={info.videoDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-action"
            >
              <PlayCircleOutlined className="action-icon" />
              <span>Video Demo</span>
            </a>
          </Tooltip>
        ) : (
          <Tooltip title="No Video Demo available">
            <span className="project-card-action is-disabled">
              <PlayCircleOutlined className="action-icon" />
              <span>Video Demo</span>
            </span>
          </Tooltip>
        )}
      </div>
    </article>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    html_url: PropTypes.string,
    portfolio_info: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      Visibilty: PropTypes.bool,
      version: PropTypes.string,
      versionNumber: PropTypes.string,
      category: PropTypes.string,
      type: PropTypes.string,
      liveDemo: PropTypes.string,
      videoDemo: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.string),
      Highlights: PropTypes.arrayOf(PropTypes.string),
      techStack: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      language: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  index: PropTypes.number,
};

/**
 * Skeleton loader component matching exact ProjectCard dimensions for 0-CLS loading states
 */
ProjectCard.Skeleton = function ProjectCardSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div className="projects-grid-item" key={idx}>
          <div className="project-card project-card-skeleton" aria-hidden="true">
            <div className="project-card-media project-card-skeleton-media" />
            <div className="project-card-body">
              <div className="project-card-title-row">
                <div className="project-skeleton-line" style={{ width: "65%", height: "24px" }} />
                <div className="project-skeleton-line" style={{ width: "48px", height: "18px", borderRadius: "10px" }} />
              </div>
              <div className="project-skeleton-line" style={{ width: "100%", height: "13px", marginTop: "12px" }} />
              <div className="project-skeleton-line" style={{ width: "85%", height: "13px", marginTop: "6px", marginBottom: "16px" }} />
              <div className="project-skeleton-highlights">
                <div className="project-skeleton-line" style={{ width: "45%", height: "12px", marginBottom: "10px" }} />
                <div className="project-skeleton-line" style={{ width: "95%", height: "11px", marginBottom: "6px" }} />
                <div className="project-skeleton-line" style={{ width: "80%", height: "11px" }} />
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "16px" }}>
                <div className="project-skeleton-line" style={{ width: "65px", height: "20px", borderRadius: "4px" }} />
                <div className="project-skeleton-line" style={{ width: "80px", height: "20px", borderRadius: "4px" }} />
                <div className="project-skeleton-line" style={{ width: "55px", height: "20px", borderRadius: "4px" }} />
              </div>
            </div>
            <div className="project-card-footer">
              <div className="project-skeleton-line" style={{ flex: 1, height: "34px", borderRadius: "6px" }} />
              <div className="project-skeleton-line" style={{ flex: 1, height: "34px", borderRadius: "6px" }} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

ProjectCard.Skeleton.propTypes = {
  count: PropTypes.number,
};