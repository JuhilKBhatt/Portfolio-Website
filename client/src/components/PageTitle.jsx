// ./client/src/components/PageTitle.jsx

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/pageTitle.css";

/**
 * PageTitle - Modular, high-impact page title component for primary page views.
 *
 * @param {string} [tag] - Eyebrow category tag (e.g. "REPOSITORIES"). Automatically prepends "// " if omitted.
 * @param {React.ReactNode} [title] - Primary page heading (h1). Can also be passed as children.
 * @param {React.ReactNode} [children] - Alternative way to pass heading content.
 * @param {React.ReactNode} [subtitle] - Page descriptive subtitle text or node.
 * @param {React.ReactNode} [description] - Alias for subtitle.
 * @param {React.ReactNode} [meta] - Status / metadata badge on right side (e.g. "12 ACTIVE BUILDS").
 * @param {React.ReactNode} [action] - Custom action element. Overrides actionText.
 * @param {string} [actionText] - Action button text.
 * @param {string} [actionLink] - Internal route (e.g. "/") or external URL.
 * @param {function} [onActionClick] - Click handler for action button.
 * @param {string} [align="left"] - Alignment mode: "left" | "center".
 * @param {boolean} [divider=true] - Whether to render the neon gradient divider line.
 * @param {string} [className=""] - Extra CSS classes.
 * @param {object} [style={}] - Inline styles.
 */
export default function PageTitle({
  tag,
  title,
  children,
  subtitle,
  description,
  meta,
  action,
  actionText,
  actionLink,
  onActionClick,
  align = "left",
  divider = true,
  className = "",
  style = {},
  ...props
}) {
  const headingContent = title || children;
  const subtitleContent = subtitle || description;
  const formattedTag = tag
    ? tag.trim().startsWith("//")
      ? tag.trim()
      : `// ${tag.trim()}`
    : null;

  const isCentered = align === "center";

  const renderAction = () => {
    if (action) return action;
    if (!actionText) return null;

    if (actionLink) {
      const isInternal = actionLink.startsWith("/") && !actionLink.startsWith("//");
      if (isInternal) {
        return (
          <Link to={actionLink} className="page-title-action">
            {actionText}
          </Link>
        );
      }
      return (
        <a
          href={actionLink}
          className="page-title-action"
          target="_blank"
          rel="noopener noreferrer"
        >
          {actionText}
        </a>
      );
    }

    return (
      <button
        type="button"
        className="page-title-action"
        onClick={onActionClick}
      >
        {actionText}
      </button>
    );
  };

  const containerClasses = [
    "page-title-container",
    isCentered ? "is-centered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={containerClasses} style={style} {...props}>
      <div className="page-title-header">
        <div className="page-title-left">
          {formattedTag && <span className="page-title-tag">{formattedTag}</span>}
          {headingContent && <h1 className="page-title-heading">{headingContent}</h1>}
          {subtitleContent && (
            <p className="page-title-subtitle">{subtitleContent}</p>
          )}
        </div>

        {(meta || action || actionText) && (
          <div className="page-title-right">
            {meta && <span className="page-title-meta">{meta}</span>}
            {renderAction()}
          </div>
        )}
      </div>

      {divider && <div className="page-title-divider" aria-hidden="true" />}
    </header>
  );
}

PageTitle.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  meta: PropTypes.node,
  action: PropTypes.node,
  actionText: PropTypes.string,
  actionLink: PropTypes.string,
  onActionClick: PropTypes.func,
  align: PropTypes.oneOf(["left", "center"]),
  divider: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export { PageTitle };
