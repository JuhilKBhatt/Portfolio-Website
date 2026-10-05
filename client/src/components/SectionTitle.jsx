// ./client/src/components/SectionTitle.jsx

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/sectionTitle.css";

/**
 * SectionTitle - Highly modular, callable section title component.
 *
 * @param {string} [tag] - Eyebrow category tag (e.g. "CAPABILITIES MATRIX"). Automatically prepends "// " if omitted.
 * @param {React.ReactNode} [title] - Main heading text (can also be passed as children).
 * @param {React.ReactNode} [children] - Alternative way to pass heading content.
 * @param {React.ReactNode} [meta] - Status / metadata badge (e.g. "PROD-VERIFIED STACK // 2025").
 * @param {React.ReactNode} [action] - Custom action element. Overrides actionText.
 * @param {string} [actionText] - Action button text (e.g. "Open Full Tech Radar & Architecture ->").
 * @param {string} [actionLink] - Internal route (e.g. "/tech-stack") or external URL.
 * @param {function} [onActionClick] - Click handler for the action button if no link is provided.
 * @param {string} [className=""] - Extra CSS classes.
 * @param {object} [style={}] - Inline styles.
 */
export default function SectionTitle({
  tag,
  title,
  children,
  meta,
  action,
  actionText,
  actionLink,
  onActionClick,
  className = "",
  style = {},
  ...props
}) {
  const headingContent = title || children;
  const formattedTag = tag
    ? tag.trim().startsWith("//")
      ? tag.trim()
      : `// ${tag.trim()}`
    : null;

  const renderAction = () => {
    if (action) return action;
    if (!actionText) return null;

    if (actionLink) {
      const isInternal = actionLink.startsWith("/") && !actionLink.startsWith("//");
      if (isInternal) {
        return (
          <Link to={actionLink} className="section-title-action">
            {actionText}
          </Link>
        );
      }
      return (
        <a
          href={actionLink}
          className="section-title-action"
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
        className="section-title-action"
        onClick={onActionClick}
      >
        {actionText}
      </button>
    );
  };

  return (
    <header className={`section-title-container ${className}`.trim()} style={style} {...props}>
      <div className="section-title-left">
        {formattedTag && <span className="section-title-tag">{formattedTag}</span>}
        {headingContent && <h2 className="section-title-heading">{headingContent}</h2>}
      </div>

      {(meta || action || actionText) && (
        <div className="section-title-right">
          {meta && <span className="section-title-meta">{meta}</span>}
          {renderAction()}
        </div>
      )}
    </header>
  );
}

SectionTitle.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.node,
  meta: PropTypes.node,
  action: PropTypes.node,
  actionText: PropTypes.string,
  actionLink: PropTypes.string,
  onActionClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export { SectionTitle };
