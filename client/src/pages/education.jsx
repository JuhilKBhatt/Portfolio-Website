// ./client/src/pages/education.jsx

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Modal, Image } from "antd";
import {
  SafetyCertificateOutlined,
  FileTextOutlined,
  TrophyOutlined,
  AuditOutlined,
  LineChartOutlined,
  EyeOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { extractEducationData } from "../scripts/extractEducationData.js";
import PageTitle from "../components/PageTitle";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/educationPage.css";

function optimizeImageUrl(url, width = 1200) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("/upload/f_auto") && !url.includes("/upload/q_auto")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
  }
  return url;
}

function formatColorCode(color) {
  if (!color || typeof color !== "string") return "#f97316";
  const trimmed = color.trim();
  if (/^[0-9A-Fa-f]{3,8}$/.test(trimmed)) {
    return `#${trimmed}`;
  }
  return trimmed;
}

function renderTabIcon(iconKey) {
  switch (iconKey) {
    case "appstore":
    case "overview":
      return <AppstoreOutlined />;
    case "safety":
      return <SafetyCertificateOutlined />;
    case "file":
      return <FileTextOutlined />;
    case "trophy":
      return <TrophyOutlined />;
    case "audit":
    default:
      return <AuditOutlined />;
  }
}

export default function Education() {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTabId, setActiveTabId] = useState("overview");
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const [overviewViewMode, setOverviewViewMode] = useState("grid");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const vaultRef = useRef(null);

  useEffect(() => {
    extractEducationData().then((data) => {
      setEducationData(data || []);
      setLoading(false);
    });
  }, []);

  // Aggregated list of all certificates across all educational institutions
  const allCertificates = useMemo(() => {
    if (!educationData || educationData.length === 0) return [];
    const list = [];
    educationData.forEach((entry) => {
      (entry.certificates || []).forEach((cert) => {
        list.push({
          ...cert,
          institutionId: entry.id,
          institutionName: entry.name,
          institutionTabLabel: entry.tabLabel || entry.name,
          institutionTheme: entry.statusTheme || "#f97316",
        });
      });
    });
    return list;
  }, [educationData]);

  // Tabs in the vault: Overview is the first and default tab, followed by institutions
  const certTabs = useMemo(() => {
    if (!educationData || educationData.length === 0) return [];
    const overviewTab = {
      id: "overview",
      tabLabel: "Overview",
      icon: "overview",
      name: "All Academic Credentials",
      certificates: allCertificates,
      isOverview: true,
    };
    const institutionTabs = educationData.map((entry) => ({
      id: entry.id,
      tabLabel: entry.tabLabel || entry.name,
      icon: entry.tabIcon,
      name: entry.name,
      certificates: (entry.certificates || []).map((cert) => ({
        ...cert,
        institutionId: entry.id,
        institutionName: entry.name,
        institutionTabLabel: entry.tabLabel || entry.name,
        institutionTheme: entry.statusTheme || "#f97316",
      })),
    }));
    return [overviewTab, ...institutionTabs];
  }, [educationData, allCertificates]);

  // Active tab and active certificate
  const activeTab = useMemo(() => {
    if (!certTabs.length) return null;
    return certTabs.find((t) => t.id === activeTabId) || certTabs[0];
  }, [certTabs, activeTabId]);

  const currentCertificates = useMemo(() => {
    if (!activeTab) return [];
    return activeTab.certificates || [];
  }, [activeTab]);

  const currentCert = useMemo(() => {
    if (!currentCertificates.length) return null;
    const clampedIndex = Math.min(activeCertIndex, currentCertificates.length - 1);
    return currentCertificates[clampedIndex] || currentCertificates[0];
  }, [currentCertificates, activeCertIndex]);

  // Procedural gradient for connecting chronology rail based on node colors
  const railGradient = useMemo(() => {
    if (!educationData || educationData.length === 0) {
      return "none";
    }

    const colors = educationData.map((node) => formatColorCode(node.statusTheme));

    if (colors.length === 1) {
      return `linear-gradient(180deg, ${colors[0]} 0%, transparent 100%)`;
    }

    // Distribute node colors proportionally along the rail (0% to ~88%), then softly fade out
    const stops = colors.map((color, idx) => {
      const pct = Math.round((idx / (colors.length - 1)) * 88);
      return `${color} ${pct}%`;
    });

    return `linear-gradient(180deg, ${stops.join(", ")}, transparent 100%)`;
  }, [educationData]);

  const scrollToVault = () => {
    if (vaultRef.current && window.innerWidth <= 1024) {
      vaultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="education-page-container">
        <PageTitle
          category="ACADEMIC CREDENTIALS"
          title="Education"
          subtitle="A summary of my academic background, qualifications and certifications that shaped my journey."
        />
        <LoadingScreen inline />
      </div>
    );
  }

  return (
    <div className="education-page-container">
      <PageTitle
        category="ACADEMIC CREDENTIALS"
        title="Education"
        subtitle="A summary of my academic background, qualifications and certifications that shaped my journey."
      />

      <div className="education-grid">
        {/* ========================================================
            LEFT COLUMN: VERIFIED CERTIFICATE ARCHIVE
            ======================================================== */}
        <div className="education-grid-left">
          <div className="cyberpunk-panel cert-vault-window" ref={vaultRef}>
            {/* macOS Window Header */}
            <div className="window-titlebar">
              <div className="window-titlebar-left">
                <div className="window-dots" aria-hidden="true">
                  <span className="window-dot window-dot-red" />
                  <span className="window-dot window-dot-yellow" />
                  <span className="window-dot window-dot-green" />
                </div>
                <span className="window-path">vault://academic-certificates</span>
              </div>
              <span className="window-status-badge">
                {activeTabId === "overview"
                  ? `ALL CREDENTIALS (${allCertificates.length})`
                  : "ARCHIVED // CLOUDINARY"}
              </span>
            </div>

            {/* Credential Selector Tabs: Overview first, then per institution */}
            <div className="cert-vault-tabs" role="tablist">
              {certTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTabId === tab.id}
                  className={`cert-tab-btn ${activeTabId === tab.id ? "is-active" : ""}`}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setActiveCertIndex(0);
                  }}
                >
                  <span className="cert-tab-icon">{renderTabIcon(tab.icon)}</span>
                  <span>{tab.tabLabel}</span>
                </button>
              ))}
            </div>

            {/* Overview Toolbar (Grid vs Focus Stage Mode Toggle) */}
            {activeTabId === "overview" && (
              <div className="cert-overview-toolbar">
                <div className="cert-overview-count">
                  <AppstoreOutlined className="toolbar-icon" />
                  <span>ALL CREDENTIALS // {allCertificates.length} ARCHIVED</span>
                </div>
                <div className="cert-view-toggle" role="group" aria-label="Overview View Mode">
                  <button
                    type="button"
                    className={`cert-toggle-btn ${overviewViewMode === "grid" ? "is-active" : ""}`}
                    onClick={() => setOverviewViewMode("grid")}
                    title="Grid View - Display all certificates simultaneously"
                  >
                    <AppstoreOutlined />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    className={`cert-toggle-btn ${overviewViewMode === "focus" ? "is-active" : ""}`}
                    onClick={() => setOverviewViewMode("focus")}
                    title="Focus View - Inspect certificates individually"
                  >
                    <EyeOutlined />
                    <span>Focus</span>
                  </button>
                </div>
              </div>
            )}

            {/* Document Stage Viewport */}
            <div
              className={`cert-preview-stage ${
                activeTabId === "overview" && overviewViewMode === "grid" ? "is-overview-grid" : ""
              }`}
            >
              {/* Overview Mode: Gallery Grid displaying ALL certificates */}
              {activeTabId === "overview" && overviewViewMode === "grid" ? (
                <div className="cert-overview-grid">
                  {allCertificates.map((cert, idx) => {
                    const institutionColor = formatColorCode(cert.institutionTheme);
                    return (
                      <div
                        key={cert.id || idx}
                        className="cert-overview-card"
                        onClick={() => {
                          setActiveCertIndex(idx);
                          setIsLightboxOpen(true);
                        }}
                        title={`Click to inspect ${cert.title}`}
                      >
                        <div className="cert-overview-thumbnail-wrapper">
                          <img
                            src={optimizeImageUrl(cert.url, 600)}
                            alt={cert.title}
                            className="cert-overview-thumb"
                            loading="lazy"
                          />
                          <div className="cert-overview-hover-overlay">
                            <EyeOutlined />
                            <span>PREVIEW</span>
                          </div>
                        </div>
                        <div className="cert-overview-card-info">
                          <span
                            className="cert-overview-badge"
                            style={{
                              borderColor: institutionColor,
                              color: institutionColor,
                            }}
                          >
                            {cert.institutionTabLabel?.split(" ")[0] || cert.institutionName}
                          </span>
                          <h5 className="cert-overview-title" title={cert.title}>
                            {cert.shortTitle || cert.title}
                          </h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : currentCertificates.length === 0 ? (
                /* Empty state for tabs with 0 certificates */
                <div className="cert-empty-state">
                  <AuditOutlined className="cert-empty-icon" />
                  <div className="cert-empty-title">NO CERTIFICATES CURRENTLY ARCHIVED</div>
                  <p className="cert-empty-desc">
                    Credentials and course completion records are actively in progress.
                  </p>
                </div>
              ) : (
                /* Single Document Stage (Focus mode or individual institution tab) */
                <>
                  <div
                    className="cert-document-wrapper"
                    onClick={() => setIsLightboxOpen(true)}
                    title="Click to expand high-resolution preview"
                  >
                    {currentCert?.url && (
                      <img
                        src={optimizeImageUrl(currentCert.url, 1200)}
                        alt={currentCert.title || activeTab?.tabLabel || "Certificate"}
                        className="cert-preview-image"
                      />
                    )}
                  </div>

                  {/* Multi-record gallery navigator */}
                  {currentCertificates.length > 1 && (
                    <div className="cert-subnav">
                      <button
                        type="button"
                        className="cert-subnav-btn"
                        disabled={activeCertIndex === 0}
                        onClick={() => setActiveCertIndex((prev) => Math.max(0, prev - 1))}
                        aria-label="Previous credential"
                      >
                        <LeftOutlined />
                      </button>
                      <span>
                        RECORD {activeCertIndex + 1} OF {currentCertificates.length}
                      </span>
                      <button
                        type="button"
                        className="cert-subnav-btn"
                        disabled={activeCertIndex === currentCertificates.length - 1}
                        onClick={() =>
                          setActiveCertIndex((prev) =>
                            Math.min(currentCertificates.length - 1, prev + 1)
                          )
                        }
                        aria-label="Next credential"
                      >
                        <RightOutlined />
                      </button>
                    </div>
                  )}

                  {/* Quick-switch pills */}
                  {currentCertificates.length > 0 && (
                    <div className="cert-subnav-pills">
                      {currentCertificates.map((cert, idx) => (
                        <button
                          key={cert.id || idx}
                          type="button"
                          className={`cert-subnav-pill ${activeCertIndex === idx ? "is-active" : ""}`}
                          onClick={() => setActiveCertIndex(idx)}
                        >
                          <span>
                            {activeTabId === "overview" && cert.institutionTabLabel
                              ? `[${cert.institutionTabLabel.split(" ")[0]}] ${
                                  cert.shortTitle || cert.title
                                }`
                              : cert.shortTitle || cert.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Certificate Stage Footer */}
            <div className="cert-vault-footer">
              <div className="cert-status-info">
                <SafetyCertificateOutlined className="status-icon" />
                <span>
                  {activeTabId === "overview"
                    ? overviewViewMode === "grid"
                      ? `${allCertificates.length} VERIFIED CREDENTIALS // CLICK ANY RECORD FOR HIGH-RES LIGHTBOX`
                      : `${currentCert?.institutionName || "VERIFIED"} // ${
                          currentCert?.title || "Credential"
                        }`
                    : currentCert
                    ? `${currentCert.institutionName || activeTab?.name} // ${currentCert.title}`
                    : "NO VERIFIED CREDENTIALS CURRENTLY ARCHIVED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: SCHOLASTIC CHRONOLOGY TIMELINE
            ======================================================== */}
        <div className="education-grid-right">
          <div className="cyberpunk-panel chronology-panel">
            {/* Header with programmatic node count */}
            <div className="chronology-header">
              <div className="chronology-title">
                <LineChartOutlined className="chronology-icon" />
                <span>Education Timeline</span>
              </div>
              <span className="chronology-badge">
                {educationData.length} NODES RECORDED
              </span>
            </div>

            {/* Dynamic Timeline mapped from educationData.json */}
            <div className="chronology-timeline">
              <div
                className="chronology-rail"
                aria-hidden="true"
                style={{ background: railGradient }}
              />

              {educationData.map((node) => {
                const nodeTheme = formatColorCode(node.statusTheme);

                // Procedural certificate / awards count calculation
                const certsCount = node.certificates?.length || 0;
                let actionText = "";
                if (certsCount === 0) {
                  actionText = "VIEW CREDENTIALS";
                } else if (certsCount === 1) {
                  actionText = "VIEW 1 CERTIFICATE";
                } else {
                  actionText = `VIEW ${certsCount} CERTIFICATES`;
                }

                return (
                  <div
                    className="chronology-node"
                    key={node.id}
                    style={{ "--node-theme": nodeTheme }}
                  >
                    <div className="chronology-marker" />
                    <div className="chronology-content">
                      <div className="chronology-node-meta">
                        <span className="chronology-eyebrow">
                          {node.statusLabel}
                        </span>
                        <span className="chronology-dates">
                          {node.dateFrom} - {node.dateTo}
                        </span>
                      </div>

                      <h3 className="chronology-institution">{node.name}</h3>
                      <h4 className="chronology-degree">
                        {node.degree}
                      </h4>

                      {node.summary && (
                        <p className="chronology-description">{node.summary}</p>
                      )}

                      {node.bullets && node.bullets.length > 0 && (
                        <ul className="chronology-bullets">
                          {node.bullets.map((bullet, idx) => (
                            <li className="chronology-bullet-item" key={idx}>
                              <span className="chronology-bullet-dot">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {node.rankPills && node.rankPills.length > 0 && (
                        <div className="chronology-rank-pills">
                          {node.rankPills.map((pill, idx) => (
                            <span className="chronology-rank-pill" key={idx}>
                              {pill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="chronology-node-footer">
                        <span className="chronology-location">{node.location}</span>
                        <button
                          type="button"
                          className="chronology-action-link"
                          onClick={() => {
                            setActiveTabId(node.id);
                            setActiveCertIndex(0);
                            scrollToVault();
                          }}
                        >
                          <span>{actionText}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for full-resolution view */}
      <Modal
        open={isLightboxOpen}
        onCancel={() => setIsLightboxOpen(false)}
        footer={null}
        centered
        width={960}
        title={currentCert?.title || activeTab?.tabLabel || "Credential Preview"}
      >
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          {currentCert?.url && (
            <Image
              src={optimizeImageUrl(currentCert.url, 1600)}
              alt={currentCert.title || activeTab?.tabLabel}
              preview={false}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}