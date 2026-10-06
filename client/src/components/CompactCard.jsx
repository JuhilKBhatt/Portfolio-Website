// ./client/src/components/CompactCard.jsx

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/compactCard.css";

function isSafeUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/") || url.startsWith("#")) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getBadgeClass(badge) {
  const normalized = String(badge || "").toLowerCase().trim();
  if (normalized === "alpha" || normalized === "aplha") return "compact-card-badge-alpha";
  if (normalized === "beta") return "compact-card-badge-beta";
  if (normalized === "prod") return "compact-card-badge-prod";
  return "";
}

/**
 * CompactCard - Modular, reusable callable card component designed to showcase projects
 * or technical items with a sleek terminal/cyberpunk aesthetic.
 *
 * Can be called with raw props for any generic use case, or passed a `project` object from the GitHub pipeline.
 */
export default function CompactCard({
  project,
  id,
  repoId: propRepoId,
  tag,
  badge,
  versionNumber,
  title,
  description,
  tags,
  maxTags = 4,
  leftMeta,
  rightMeta,
  link,
  className = "",
  style = {},
  onClick,
  children,
}) {
  const info = project?.portfolio_info || {};

  // Title: prop > info.title > project.name
  const resolvedTitle = title || info.title || project?.name || "";

  // Category loaded directly from PortfolioWebsiteInfo.json (single source of truth)
  const category = (info.category || info.type || "").toUpperCase();

  // Dynamic tag: uses the repo ID from GitHub and category from PortfolioWebsiteInfo.json
  const repoId = propRepoId ?? id ?? project?.id;
  const hasRepoId = repoId != null && repoId !== "";
  const resolvedTag = tag || (
    hasRepoId && category
      ? `PROJ-${repoId} // ${category}`
      : hasRepoId
      ? `PROJ-${repoId}`
      : category
      ? `PROJ // ${category}`
      : project
      ? "PROJ"
      : null
  );

  // Status badge loaded from PortfolioWebsiteInfo.json (single source of truth: alpha, beta, prod)
  const resolvedBadge = badge || info.version;
  const badgeClass = resolvedBadge ? getBadgeClass(resolvedBadge) : "";

  // Version number loaded from PortfolioWebsiteInfo.json (single source of truth)
  const rawVersionNumber = versionNumber ?? info.versionNumber;
  const resolvedVersionNumber = rawVersionNumber
    ? (String(rawVersionNumber).startsWith("v") ? rawVersionNumber : `v${rawVersionNumber}`)
    : null;

  // Description: prop > info.description > project.description
  const resolvedDescription = description || info.description || project?.description || "";

  // Tags loaded from PortfolioWebsiteInfo.json (techStack or language)
  const rawTags = useMemo(() => {
    if (Array.isArray(tags)) return tags;
    if (info.techStack && typeof info.techStack === "object") {
      return Object.values(info.techStack).flat();
    }
    if (Array.isArray(info.language)) {
      return info.language;
    }
    return [];
  }, [tags, info.techStack, info.language]);

  const resolvedTags = useMemo(() => {
    return rawTags.filter((t) => typeof t === "string" && t.trim() !== "");
  }, [rawTags]);

  const displayedTags = useMemo(() => {
    if (!maxTags || maxTags <= 0 || resolvedTags.length <= maxTags) {
      return { visible: resolvedTags, remaining: 0 };
    }
    return {
      visible: resolvedTags.slice(0, maxTags),
      remaining: resolvedTags.length - maxTags,
    };
  }, [resolvedTags, maxTags]);

  // Footer metadata
  const resolvedLeftMeta = leftMeta ?? info.leftMeta ?? (info.type ? `TYPE: ${String(info.type).toUpperCase()}` : null);
  const resolvedRightMeta = rightMeta ?? info.rightMeta ?? (info.liveDemo ? "DEMO: LIVE" : project?.html_url ? "REPO: GITHUB" : null);

  const resolvedLink = link || info.liveDemo || project?.html_url;
  const isClickable = Boolean(resolvedLink || onClick);

  const cardContent = (
    <>
      {/* Top Header: Tag, Version Number & Status Badge */}
      <div className="compact-card-header">
        <span className="compact-card-tag">{resolvedTag}</span>
        {(resolvedVersionNumber || resolvedBadge) && (
          <div className="compact-card-header-badges">
            {resolvedVersionNumber && (
              <span className="compact-card-version">{resolvedVersionNumber}</span>
            )}
            {resolvedBadge && (
              <span className={`compact-card-badge ${badgeClass}`.trim()}>
                {resolvedBadge}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="compact-card-content">
        <h3 className="compact-card-title">{resolvedTitle}</h3>
        {resolvedDescription && (
          <p className="compact-card-description">{resolvedDescription}</p>
        )}

        {/* Children for custom injection if needed */}
        {children}

        {/* Tag Pills */}
        {displayedTags.visible.length > 0 && (
          <div className="compact-card-tags">
            {displayedTags.visible.map((t, idx) => (
              <span key={`${t}-${idx}`} className="compact-card-tag-pill">
                {t}
              </span>
            ))}
            {displayedTags.remaining > 0 && (
              <span
                className="compact-card-tag-pill compact-card-tag-more"
                title={`${displayedTags.remaining} more technologies`}
              >
                +{displayedTags.remaining}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Monospace Footer */}
      {(resolvedLeftMeta || resolvedRightMeta) && (
        <div className="compact-card-footer">
          <div className="compact-card-meta-left">
            <span>{resolvedLeftMeta}</span>
          </div>
          <div className="compact-card-meta-right">
            <span>{resolvedRightMeta}</span>
          </div>
        </div>
      )}
    </>
  );

  const containerClasses = `compact-card ${isClickable ? "is-clickable" : ""} ${className}`.trim();

  // If a safe internal route link is provided, render as React Router Link
  if (resolvedLink && typeof resolvedLink === "string" && resolvedLink.startsWith("/")) {
    return (
      <Link
        to={resolvedLink}
        className={containerClasses}
        style={style}
        onClick={onClick}
      >
        {cardContent}
      </Link>
    );
  }

  // If a safe external link is provided, render as an anchor for native SEO and accessibility
  if (resolvedLink && isSafeUrl(resolvedLink)) {
    return (
      <a
        href={resolvedLink}
        target="_blank"
        rel="noopener noreferrer"
        className={containerClasses}
        style={style}
        onClick={onClick}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div
      className={containerClasses}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {cardContent}
    </div>
  );
}

/**
 * Responsive Grid wrapper component for rendering groups of CompactCards
 */
CompactCard.Grid = function CompactCardGrid({ children, className = "", style = {} }) {
  return (
    <div className={`compact-cards-grid ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

CompactCard.Grid.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Skeleton loader component for zero-CLS inline loading states
 */
CompactCard.Skeleton = function CompactCardSkeleton({ count = 4, className = "" }) {
  return (
    <CompactCard.Grid className={className}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="compact-card compact-card-skeleton" aria-hidden="true">
          <div className="compact-card-header">
            <div className="compact-card-skeleton-line" style={{ width: "40%", height: "14px" }} />
            <div className="compact-card-skeleton-line" style={{ width: "18%", height: "20px", borderRadius: "4px" }} />
          </div>
          <div className="compact-card-content">
            <div className="compact-card-skeleton-line" style={{ width: "65%", height: "24px", margin: "6px 0 14px 0" }} />
            <div className="compact-card-skeleton-line" style={{ width: "100%", height: "13px", marginBottom: "8px" }} />
            <div className="compact-card-skeleton-line" style={{ width: "95%", height: "13px", marginBottom: "8px" }} />
            <div className="compact-card-skeleton-line" style={{ width: "80%", height: "13px", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="compact-card-skeleton-line" style={{ width: "55px", height: "24px", borderRadius: "4px" }} />
              <div className="compact-card-skeleton-line" style={{ width: "70px", height: "24px", borderRadius: "4px" }} />
              <div className="compact-card-skeleton-line" style={{ width: "80px", height: "24px", borderRadius: "4px" }} />
            </div>
          </div>
          <div className="compact-card-footer">
            <div className="compact-card-skeleton-line" style={{ width: "35%", height: "12px" }} />
            <div className="compact-card-skeleton-line" style={{ width: "25%", height: "12px" }} />
          </div>
        </div>
      ))}
    </CompactCard.Grid>
  );
};

CompactCard.Skeleton.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
};

CompactCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    html_url: PropTypes.string,
    portfolio_info: PropTypes.object,
  }),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  repoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tag: PropTypes.string,
  badge: PropTypes.string,
  versionNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  maxTags: PropTypes.number,
  leftMeta: PropTypes.node,
  rightMeta: PropTypes.node,
  link: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
