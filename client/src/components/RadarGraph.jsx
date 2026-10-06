// ./client/src/components/RadarGraph.jsx

import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import "../styles/radarGraph.css";

const DEFAULT_CATEGORIES = [
  "Frontend",
  "Backend",
  "AI",
  "DevSecOps",
  "Test Automation",
];

const LEVELS = [0.25, 0.5, 0.75, 1.0];
const CX = 250;
const CY = 250;
const RADIUS = 150;

function getCoordinates(index, total, rRatio, cx = CX, cy = CY, radius = RADIUS) {
  const safeTotal = total > 0 ? total : 1;
  const angle = (index * 2 * Math.PI) / safeTotal - Math.PI / 2;
  const r = radius * rRatio;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
    angle,
  };
}

/**
 * RadarGraph - Interactive SVG Radar Graph displaying tech stack data across all projects.
 * Supports viewing the overall disciplines overview or drilling into any specific category
 * to see its individual technologies and project associations.
 */
export default function RadarGraph({
  techStack,
  categoryData,
  className = "",
  style = {},
}) {
  const [selectedCategory, setSelectedCategory] = useState("OVERVIEW");
  const [activeItem, setActiveItem] = useState(null);

  // Normalize category metadata across all projects
  const normalizedOverview = useMemo(() => {
    const categories = DEFAULT_CATEGORIES;
    const maxProjects = Math.max(
      1,
      ...categories.map((cat) => categoryData?.[cat]?.projectCount || 0)
    );

    return categories.map((name) => {
      const data = categoryData?.[name] || {};
      const tools = data.tools || (techStack?.[name] || []).map((t) => ({ name: t, count: 1, projects: [] }));
      const projectCount = data.projectCount || (tools.length > 0 ? 1 : 0);
      const totalTools = data.totalTools || tools.length;
      const projects = data.projects || [];

      // Scale value between 0.35 and 0.95 based on project coverage & tool depth
      const ratio = projectCount === 0
        ? 0.25
        : Math.min(0.95, 0.35 + (projectCount / maxProjects) * 0.6);

      return {
        key: name,
        label: name,
        subLabel: `${projectCount} ${projectCount === 1 ? "project" : "projects"} · ${totalTools} tools`,
        ratio,
        value: Math.round(ratio * 100),
        projectCount,
        totalTools,
        tools,
        projects,
      };
    });
  }, [categoryData, techStack]);

  // Normalize drill-down data for a single category
  const normalizedCategoryTools = useMemo(() => {
    if (selectedCategory === "OVERVIEW") return [];

    const catInfo = categoryData?.[selectedCategory];
    const rawTools = catInfo?.tools || (techStack?.[selectedCategory] || []).map((t) => ({
      name: t,
      count: 1,
      projects: [],
    }));

    if (!rawTools || rawTools.length === 0) return [];

    const maxCount = Math.max(1, ...rawTools.map((t) => t.count || 1));

    return rawTools.map((tool) => {
      const count = tool.count || 1;
      const ratio = Math.min(0.95, 0.35 + (count / maxCount) * 0.6);

      return {
        key: tool.name,
        label: tool.name,
        subLabel: `${count} ${count === 1 ? "project" : "projects"}`,
        ratio,
        value: count,
        projectCount: count,
        projects: tool.projects || [],
        isTool: true,
      };
    });
  }, [selectedCategory, categoryData, techStack]);

  // Current active axes for radar geometry
  const currentAxes = useMemo(() => {
    if (selectedCategory === "OVERVIEW") {
      return normalizedOverview;
    }
    // Limit to top 10 tools on the radar geometry for readability if category has many tools
    return normalizedCategoryTools.slice(0, 10);
  }, [selectedCategory, normalizedOverview, normalizedCategoryTools]);

  const n = currentAxes.length;

  // Concentric polygons points strings
  const levelPolygons = useMemo(() => {
    if (n < 3) return [];
    return LEVELS.map((lvl) => {
      return currentAxes
        .map((_, i) => {
          const { x, y } = getCoordinates(i, n, lvl);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
    });
  }, [currentAxes, n]);

  // Data polygon points string
  const dataPolygonPoints = useMemo(() => {
    if (n < 3) return "";
    return currentAxes
      .map((item, i) => {
        const { x, y } = getCoordinates(i, n, item.ratio);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [currentAxes, n]);

  const totalAllProjects = useMemo(() => {
    const all = new Set();
    Object.values(categoryData || {}).forEach((cat) => {
      (cat.projects || []).forEach((p) => all.add(p));
    });
    return all.size || 1;
  }, [categoryData]);

  const totalAllTools = useMemo(() => {
    let count = 0;
    Object.values(categoryData || {}).forEach((cat) => {
      count += cat.totalTools || (cat.tools || []).length || 0;
    });
    return count;
  }, [categoryData]);

  const selectedCategoryInfo = selectedCategory !== "OVERVIEW" ? categoryData?.[selectedCategory] : null;

  return (
    <div className={`radar-graph-container ${className}`.trim()} style={style}>
      {/* Category Filter Pills Navigation */}
      <div className="radar-tabs-nav" role="tablist" aria-label="Tech Stack Category Views">
        <button
          type="button"
          className={`radar-tab-btn ${selectedCategory === "OVERVIEW" ? "is-active" : ""}`}
          onClick={() => {
            setSelectedCategory("OVERVIEW");
            setActiveItem(null);
          }}
        >
          <span className="radar-tab-icon">🌐</span>
          <span>Overview</span>
          <span className="radar-tab-badge">{DEFAULT_CATEGORIES.length}</span>
        </button>

        {DEFAULT_CATEGORIES.map((catName) => {
          const info = categoryData?.[catName];
          const count = info?.projectCount ?? (techStack?.[catName]?.length ? 1 : 0);
          const isActive = selectedCategory === catName;

          return (
            <button
              key={catName}
              type="button"
              className={`radar-tab-btn ${isActive ? "is-active" : ""}`}
              onClick={() => {
                setSelectedCategory(catName);
                setActiveItem(null);
              }}
            >
              <span>{catName}</span>
              <span className="radar-tab-badge">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="radar-graph-layout">
        {/* SVG Radar Chart */}
        <div className="radar-svg-wrapper">
          <svg
            className="radar-svg"
            viewBox="0 0 500 500"
            role="img"
            aria-label={`${selectedCategory} skills radar graph`}
          >
            <defs>
              <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97736" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#ea580c" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#9a3412" stopOpacity="0.15" />
              </radialGradient>
            </defs>

            {/* Concentric grid polygons (or circles for small N) */}
            {n >= 3 ? (
              levelPolygons.map((points, idx) => (
                <polygon
                  key={idx}
                  points={points}
                  className={`radar-grid-polygon ${idx === levelPolygons.length - 1 ? "radar-grid-polygon-outer" : ""}`}
                />
              ))
            ) : (
              LEVELS.map((lvl, idx) => (
                <circle
                  key={idx}
                  cx={CX}
                  cy={CY}
                  r={RADIUS * lvl}
                  className={`radar-grid-polygon ${idx === LEVELS.length - 1 ? "radar-grid-polygon-outer" : ""}`}
                />
              ))
            )}

            {/* Radiating axis lines */}
            {currentAxes.map((_, i) => {
              const { x, y } = getCoordinates(i, n, 1.0);
              return (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={x}
                  y2={y}
                  className="radar-axis-line"
                />
              );
            })}

            {/* Core center dot */}
            <circle cx={CX} cy={CY} r={3.5} className="radar-center-core" />

            {/* Data Polygon or Spoke lines */}
            {n >= 3 && dataPolygonPoints && (
              <polygon
                points={dataPolygonPoints}
                className="radar-data-polygon"
              />
            )}

            {n < 3 && currentAxes.map((item, i) => {
              const pt = getCoordinates(i, n, item.ratio);
              return (
                <line
                  key={`spoke-${i}`}
                  x1={CX}
                  y1={CY}
                  x2={pt.x}
                  y2={pt.y}
                  className="radar-data-spoke"
                />
              );
            })}

            {/* Vertices & Outer Labels */}
            {currentAxes.map((item, i) => {
              const dataPoint = getCoordinates(i, n, item.ratio);
              const labelPoint = getCoordinates(i, n, 1.25);
              const isActive = activeItem === item.key;

              // Text anchor calculation based on position relative to center
              let anchor = "middle";
              if (labelPoint.x > CX + 20) anchor = "start";
              else if (labelPoint.x < CX - 20) anchor = "end";

              const handleClick = () => {
                if (selectedCategory === "OVERVIEW") {
                  setSelectedCategory(item.key);
                  setActiveItem(null);
                } else {
                  setActiveItem(activeItem === item.key ? null : item.key);
                }
              };

              return (
                <g key={item.key}>
                  {/* Vertex Interactive Group */}
                  <g
                    className={`radar-vertex-group ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setActiveItem(item.key)}
                    onMouseLeave={() => setActiveItem(null)}
                    onClick={handleClick}
                  >
                    <circle
                      cx={dataPoint.x}
                      cy={dataPoint.y}
                      r={7}
                      className="radar-vertex-halo"
                    />
                    <circle
                      cx={dataPoint.x}
                      cy={dataPoint.y}
                      r={4}
                      className="radar-vertex-point"
                    />
                  </g>

                  {/* Outer Axis Label */}
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor={anchor}
                    className={`radar-label ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setActiveItem(item.key)}
                    onMouseLeave={() => setActiveItem(null)}
                    onClick={handleClick}
                  >
                    {item.label}
                  </text>
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y + 14}
                    textAnchor={anchor}
                    className="radar-label-count"
                  >
                    {item.subLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Details Panel: Category & Projects Breakdown */}
        <div className="radar-details-panel">
          {/* Header */}
          <div className="radar-details-header">
            <div>
              <h3 className="radar-details-title">
                {selectedCategory === "OVERVIEW"
                  ? "Engineering Stack Overview"
                  : `${selectedCategory} Stack`}
              </h3>
              <span className="radar-details-subtitle">
                {selectedCategory === "OVERVIEW"
                  ? `${totalAllProjects} total projects analyzed across ${totalAllTools} skills`
                  : `${selectedCategoryInfo?.projectCount || 0} projects utilizing ${selectedCategoryInfo?.totalTools || 0} technologies`}
              </span>
            </div>

            {selectedCategory !== "OVERVIEW" ? (
              <button
                type="button"
                className="radar-back-btn"
                onClick={() => {
                  setSelectedCategory("OVERVIEW");
                  setActiveItem(null);
                }}
              >
                ← All Disciplines
              </button>
            ) : (
              <span className="radar-details-total">
                5 Disciplines
              </span>
            )}
          </div>

          {/* OVERVIEW VIEW: List of All 5 Categories */}
          {selectedCategory === "OVERVIEW" && (
            <div className="radar-categories-grid">
              {normalizedOverview.map((cat) => {
                const isActive = activeItem === cat.key;
                return (
                  <div
                    key={cat.key}
                    className={`radar-category-card ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setActiveItem(cat.key)}
                    onMouseLeave={() => setActiveItem(null)}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setActiveItem(null);
                    }}
                  >
                    <div className="radar-category-top">
                      <span className="radar-category-name">{cat.label}</span>
                      <span className="radar-category-count">
                        {cat.projectCount} {cat.projectCount === 1 ? "project" : "projects"} · {cat.totalTools} tools
                      </span>
                    </div>

                    <div className="radar-tags-list">
                      {cat.tools.slice(0, 8).map((tool) => (
                        <span key={tool.name} className="radar-skill-tag">
                          {tool.name}
                          {tool.count > 1 ? ` (${tool.count})` : ""}
                        </span>
                      ))}
                      {cat.tools.length > 8 && (
                        <span className="radar-skill-tag radar-more-tag">
                          +{cat.tools.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DRILL-DOWN CATEGORY VIEW: Detailed Tools & Projects */}
          {selectedCategory !== "OVERVIEW" && (
            <div className="radar-category-drilldown">
              {/* Category-wide Projects Badge Bar */}
              {selectedCategoryInfo?.projects?.length > 0 && (
                <div className="radar-projects-summary">
                  <span className="radar-projects-summary-title">Projects in this discipline:</span>
                  <div className="radar-projects-tags">
                    {selectedCategoryInfo.projects.map((projTitle) => (
                      <span key={projTitle} className="radar-project-badge">
                        📁 {projTitle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools List for this Category */}
              <div className="radar-tools-list">
                {selectedCategoryInfo?.tools?.map((tool) => {
                  const isActive = activeItem === tool.name;
                  return (
                    <div
                      key={tool.name}
                      className={`radar-tool-card ${isActive ? "is-active" : ""}`}
                      onMouseEnter={() => setActiveItem(tool.name)}
                      onMouseLeave={() => setActiveItem(null)}
                      onClick={() => setActiveItem(activeItem === tool.name ? null : tool.name)}
                    >
                      <div className="radar-tool-header">
                        <span className="radar-tool-name">{tool.name}</span>
                        <span className="radar-tool-count">
                          {tool.count} {tool.count === 1 ? "project" : "projects"}
                        </span>
                      </div>

                      {tool.projects && tool.projects.length > 0 && (
                        <div className="radar-tool-projects">
                          {tool.projects.map((proj) => (
                            <span key={proj} className="radar-tool-project-pill">
                              {proj}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

RadarGraph.propTypes = {
  techStack: PropTypes.object,
  categoryData: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};
