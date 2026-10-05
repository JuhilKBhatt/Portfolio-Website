// ./client/src/pages/home.jsx

import React, { useMemo, useEffect, useState } from "react";
import { Button, Carousel, Row, Col, Tag, Typography, Timeline, Space, Tooltip } from "antd";
import { FolderOpenFilled, MailFilled, EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { extractWorkData } from "../scripts/extractWorkData";
import ProjectCard from "../components/ProjectCard";
import "../styles/customHomePage.css";
import ActiveDot from "../components/ActiveDot";
import LoadingScreen from "../components/LoadingScreen";
import MetricsBanner from "../components/MetricsBanner";

// TODO: replace with real figures
const heroMetrics = [
  { label: "Professional Tenure", value: "8+ Years", description: "Staff & Principal systems capacity" },
  { label: "Community Impact", value: "1.4k+ Stars", description: "Distributed tools & Rust crates" },
  { label: "Historic Availability", value: "99.99%", description: "Guaranteed mission-critical SLAs" },
  { label: "Daily Pipeline Volume", value: "500M+ Evts", description: "Zero message drop persistence" },
];

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const { projects } = useProjects("juhilkbhatt");
  const [recentWork, setRecentWork] = useState([]);

  useEffect(() => {
    extractWorkData().then((data) => setRecentWork(data));
  }, []);

  const skills = useMemo(() => {
    const allSkills = projects
      .flatMap((p) => p.portfolio_info?.language || [])
      .filter((skill) => skill && skill.trim() !== "");
    return Array.from(new Set(allSkills));
  }, [projects]);

  const tagColors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];
  const getSkillColor = (skill) => {
    let hash = 0;
    for (let i = 0; i < skill.length; i++) {
      hash = skill.charCodeAt(i) + ((hash << 5) - hash);
    }
    return tagColors[Math.abs(hash) % tagColors.length];
  };

  // Get up to 6 shuffled priority 1 projects
  const featuredProjects = useMemo(() => {
    const filtered = projects.filter(
      (p) => p.portfolio_info?.Priority === 1
    );
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [projects]);

  // Group projects into arrays of 3
  const groupedProjects = useMemo(() => {
    const groups = [];
    for (let i = 0; i < featuredProjects.length; i += 3) {
      groups.push(featuredProjects.slice(i, i + 3));
    }
    return groups;
  }, [featuredProjects]);

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
    </>
  );
}