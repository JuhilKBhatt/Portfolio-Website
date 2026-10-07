// ./client/src/pages/experience.jsx

import React, { useEffect, useState, useMemo } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { extractWorkData } from "../scripts/extractWorkData";
import { formatWorkDatePill, calculateWorkDuration } from "../scripts/utility";
import PageTitle from "../components/PageTitle";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/workPage.css";

function renderHighlightedText(text) {
  if (!text || typeof text !== "string") return text;
  // Parse **bold** markdown segments
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const content = part.slice(2, -2);
      // Metric highlight check (currency, percentages, savings, numbers)
      const isMetric = /[$%]|savings|reduced|slashed|speed|availability|efficiency/i.test(content);
      return (
        <strong
          key={i}
          className={`work-highlight ${isMetric ? "work-highlight-metric" : "work-highlight-tech"}`}
        >
          {content}
        </strong>
      );
    }
    return part;
  });
}

export default function Experience() {
  const [workData, setWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("ALL");

  useEffect(() => {
    extractWorkData().then((data) => {
      setWorkData(data || []);
      setLoading(false);
    });
  }, []);

  // Extract unique companies from workData preserving chronological discovery
  const companies = useMemo(() => {
    if (!workData || workData.length === 0) return [];
    const set = new Set();
    workData.forEach((item) => {
      if (item.name) set.add(item.name.trim());
    });
    return Array.from(set);
  }, [workData]);

  // Filtered milestones
  const filteredData = useMemo(() => {
    if (selectedCompany === "ALL") return workData;
    return workData.filter(
      (item) => (item.name || "").trim().toLowerCase() === selectedCompany.toLowerCase()
    );
  }, [workData, selectedCompany]);

  // Procedural gradient connecting timeline rail through node theme colors
  const railGradient = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return "none";
    const colors = filteredData.map((d) => d.themeColor || "#ea580c");
    if (colors.length === 1) {
      return `linear-gradient(180deg, ${colors[0]} 0%, transparent 100%)`;
    }
    const stops = colors.map((color, idx) => {
      const pct = Math.round((idx / (colors.length - 1)) * 92);
      return `${color} ${pct}%`;
    });
    return `linear-gradient(180deg, ${stops.join(", ")}, transparent 100%)`;
  }, [filteredData]);

  return (
    <div className="work-page-container">
      <PageTitle
        tag="CAREER LOG"
        title="Work Experience"
        subtitle="A breakdown of roles I've worked in and the time spent in each - from customer support to IT & management."
        meta={!loading && workData.length > 0 ? `${filteredData.length} MILESTONES RECORDED` : null}
      />

      {/* Filter toolbar matching the mockup */}
      {!loading && companies.length > 0 && (
        <div className="work-filter-bar">
          <div className="work-filter-label">
            <FilterOutlined className="work-filter-icon" />
            <span>FILTER:</span>
          </div>
          <div className="work-filter-buttons" role="tablist" aria-label="Company Filter">
            <button
              type="button"
              role="tab"
              aria-selected={selectedCompany === "ALL"}
              className={`work-filter-btn ${selectedCompany === "ALL" ? "is-active" : ""}`}
              onClick={() => setSelectedCompany("ALL")}
            >
              [ All Milestones ]
            </button>
            {companies.map((company) => {
              const isActive = selectedCompany.toLowerCase() === company.toLowerCase();
              return (
                <button
                  key={company}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`work-filter-btn ${isActive ? "is-active" : ""}`}
                  onClick={() => setSelectedCompany(company)}
                >
                  [ {company} ]
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading & Empty States */}
      {loading ? (
        <LoadingScreen inline />
      ) : filteredData.length === 0 ? (
        <div className="work-empty-state">
          <p>No milestones found for "{selectedCompany}".</p>
          <button
            type="button"
            className="work-reset-filter-btn"
            onClick={() => setSelectedCompany("ALL")}
          >
            View All Milestones
          </button>
        </div>
      ) : (
        /* Vertical Cyberpunk Timeline */
        <div className="work-timeline-container">
          <div
            className="work-timeline-rail"
            style={{ background: railGradient }}
            aria-hidden="true"
          />

          {filteredData.map((entry, index) => {
            const themeColor = entry.themeColor || "#ea580c";
            const dateRange = formatWorkDatePill(entry.dateFrom, entry.dateTo);
            const duration = calculateWorkDuration(entry.dateFrom, entry.dateTo);
            const isActiveDispatch =
              entry.status?.toLowerCase().includes("active") ||
              entry.dateTo?.toLowerCase() === "present";

            return (
              <div
                key={entry.id || `${entry.name}-${index}`}
                className="work-timeline-item"
                style={{ "--node-color": themeColor }}
              >
                {/* Glowing Outer Ring + Inner Dot Node */}
                <div className="work-node-marker" aria-hidden="true">
                  <div className="work-node-ring">
                    <div className="work-node-dot" />
                  </div>
                </div>

                {/* Cyberpunk Work Card */}
                <div className="work-card">
                  {/* Top Bar: Badges + Date Pill + Duration */}
                  <div className="work-card-header">
                    <div className="work-card-badges">
                      <span className={`work-status-badge ${isActiveDispatch ? "is-active" : ""}`}>
                        {isActiveDispatch && <span className="work-status-dot" />}
                        {entry.status || (isActiveDispatch ? "Active Dispatch" : "Concluded Service")}
                      </span>
                      {entry.location && (
                        <span className="work-location-badge">{entry.location}</span>
                      )}
                    </div>

                    <div className="work-card-date-col">
                      <span className="work-date-pill">{dateRange}</span>
                      {duration && <span className="work-duration-text">{duration}</span>}
                    </div>
                  </div>

                  {/* Role Title & Company */}
                  <div className="work-title-row">
                    <h3 className="work-role-title">{entry.position}</h3>
                    <h4 className="work-company-name" style={{ color: themeColor }}>
                      {entry.name}
                    </h4>
                  </div>

                  {/* Highlights / Bullets List */}
                  {entry.description && entry.description.length > 0 && (
                    <div className="work-bullets-list">
                      {entry.description.map((bullet, bIdx) => (
                        <div className="work-bullet-item" key={bIdx}>
                          <span
                            className="work-bullet-icon"
                            style={{ color: themeColor }}
                            aria-hidden="true"
                          >
                            {entry.bulletIcon === "code" ? (
                              <span className="work-bullet-code">&lt;&gt;</span>
                            ) : (
                              <svg
                                className="work-bullet-svg"
                                viewBox="0 0 16 16"
                                width="12"
                                height="12"
                                fill="currentColor"
                              >
                                <path d="M5.5 3.5L11.5 8L5.5 12.5V3.5Z" />
                              </svg>
                            )}
                          </span>
                          <span className="work-bullet-text">
                            {renderHighlightedText(bullet)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skill & Technology Tag Pills */}
                  {entry.skills && entry.skills.length > 0 && (
                    <div className="work-tags-row">
                      {entry.skills.map((skill, sIdx) => {
                        const tagText = skill.startsWith("#") ? skill : `#${skill}`;
                        return (
                          <span className="work-skill-pill" key={sIdx}>
                            {tagText}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}