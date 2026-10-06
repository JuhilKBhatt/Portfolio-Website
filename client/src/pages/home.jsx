// ./client/src/pages/home.jsx

import React, { useMemo, useEffect, useState } from "react";
import { Button } from "antd";
import { FolderOpenFilled, MailFilled, EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { extractWorkData } from "../scripts/extractWorkData";
import "../styles/customHomePage.css";
import ActiveDot from "../components/ActiveDot";
import MetricsBanner from "../components/MetricsBanner";
import SectionTitle from "../components/SectionTitle";
import { useGitHubStats } from "../hooks/useGitHubStats";

export default function Home() {
  const { stats } = useGitHubStats("juhilkbhatt");
  const [recentWork, setRecentWork] = useState([]);

  useEffect(() => {
    extractWorkData().then((data) => setRecentWork(data));
  }, []);

  const tenureYears = useMemo(() => {
    // Single source of truth: strictly derived from Software Engineer roles
    const parseDate = (str) => {
      if (!str) return null;
      const [month, year] = str.split("/");
      return new Date(parseInt(year, 10), parseInt(month, 10) - 1);
    };

    const sweStartDates = recentWork
      .filter((w) => /software engineer/i.test(w.position || w.rawPosition || ""))
      .map((w) => parseDate(w.dateFrom))
      .filter(Boolean);

    if (!sweStartDates.length) return "";

    const earliest = new Date(Math.min(...sweStartDates));
    const now = new Date();
    const diffYears = (now - earliest) / (1000 * 60 * 60 * 24 * 365.25);
    const years = Math.floor(diffYears);
    return years > 0 ? `${years}+ Years` : "<1 Year";
  }, [recentWork]);

  const heroMetrics = useMemo(() => {
    // Single source of truth: strictly derived from stats API response, no hardcoded fallbacks
    const reposValue = stats?.total_projects != null ? `${stats.total_projects}+` : "";
    const commitsValue = stats?.total_commits != null
      ? (stats.total_commits >= 1000
          ? `${(stats.total_commits / 1000).toFixed(1).replace(/\.0$/, "")}k+`
          : `${stats.total_commits}+`)
      : "";
    const contributionsValue = stats?.community_contributions != null
      ? `${stats.community_contributions}+`
      : "";

    return [
      {
        label: "Professional Tenure",
        value: tenureYears,
        description: "Software engineering capacity",
      },
      {
        label: "github repositories",
        value: reposValue,
        description: "Public projects & architectures",
      },
      {
        label: "github commits",
        value: commitsValue,
        description: "Production codebase revisions",
      },
      {
        label: "Community contributions",
        value: contributionsValue,
        description: "Open source contributions & commits",
      },
    ];
  }, [stats, tenureYears]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-img-wrapper">
          <picture className="hero-img-picture">
            <source srcSet="img/AvatarImg.webp" type="image/webp" />
            <img
              className="AvatarImg"
              src="img/AvatarImg.png"
              alt="Juhil Bhatt Avatar"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="hero-card-info">
            <div className="hero-card-badge">
              <ActiveDot color="#77ea41ff" size={5} className="nav-active-dot-mobile" />
              <span>AVAILABLE FOR WORK</span>
            </div>
            <h3 className="hero-card-name">Juhil K. Bhatt</h3>
            <div className="hero-card-location">
              <EnvironmentOutlined className="location-icon" />
              <span> Sydney, Australia &amp; Remote</span>
            </div>
          </div>
        </div>
        <div className="hero-text">
          <h2 style={{color:"#CCCCCC"}}>FULL STACK & AI</h2>
          <h2 style={{color:"#b06b16ff"}}>SOFTWARE ENGINEER</h2>
          <p> Software engineer with professional experience building active production systems. Studied Enterprise System
              Development with a sub major in Computer Graphics and Animation, Networking and Cybersecurity.</p>
          <div className="hero-actions">
            <Button icon={<MailFilled/>} type="primary" size="large">
              <Link to="/contact">Get In Touch</Link>
            </Button>
            <Button icon={ <FolderOpenFilled/> } size="large">
              <Link to="/projects">Featured Works</Link>
            </Button>
          </div>
        </div>
      </section>

      <MetricsBanner metrics={heroMetrics} />

      <section style={{ width: "min(1200px, calc(100% - 32px))", margin: "0 auto clamp(40px, 5vw, 72px)" }}>
        <SectionTitle
          tag="Radar Graph"
          title="HANDS ON EXPERIENCE"
          meta="Tools and technologies I work with"
          actionText="View Full Tech Stack List ->"
          actionLink="/tech-stack"
        />
      </section>

      <section style={{ width: "min(1200px, calc(100% - 32px))", margin: "0 auto clamp(40px, 5vw, 72px)" }}>
        <SectionTitle
          tag="Compact Cards"
          title="RECENT PROJECTS"
          meta="Showcase of my software solutions"
          actionText="View Full Project List ->"
          actionLink="/projects"
        />
      </section>

      <section style={{ width: "min(1200px, calc(100% - 32px))", margin: "0 auto clamp(40px, 5vw, 72px)" }}>
        <SectionTitle
          tag="Form"
          title="INTERESTED IN WORKING TOGETHER?"
          meta="Have an opporunity for me?"
          actionText="Let's start a conversation"
          actionLink="/contact"
        />
      </section>
    </>
  );
}