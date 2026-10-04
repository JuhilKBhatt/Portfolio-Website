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
              <ActiveDot color="#ee9c22ff" size={5} className="nav-active-dot-mobile" />
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="skills-section">
          <div className="section-header">
            <h2>Skills & Technologies</h2>
            <div className="divider"></div>
          </div>
          <div className="skills-container">
            {skills.map((skill) => (
              <Tag color={getSkillColor(skill)} key={skill} className="skill-tag">
                {skill}
              </Tag>
            ))}
          </div>
        </section>
      )}

      {/* Experience Snapshot Section */}
      {recentWork.length > 0 && (
        <section className="experience-snapshot">
          <div className="section-header">
            <h2>Recent Experience</h2>
            <div className="divider"></div>
          </div>
          <div className="snapshot-container">
            <Timeline
              items={recentWork.slice(0, 2).map((work) => ({
                children: (
                  <div className="snapshot-item">
                    <Text strong className="snapshot-role">{work.position}</Text>
                    <div className="snapshot-company">{work.name}</div>
                    <div className="snapshot-dates">{work.dateFrom} - {work.dateTo || "Present"}</div>
                  </div>
                ),
              }))}
            />
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Button type="default">
                <Link to="/work">View Full Work History</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="featured-projects">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <p>Some highlights from my portfolio</p>
          <div className="divider"></div>
        </div>

        {projects.length === 0 ? (
          <LoadingScreen inline />
        ) : (
          <Carousel dots autoplay={false}>
            {groupedProjects.map((group) => {
              const groupKey = group.map((project) => project.id || project.name).join("-");
              return (
                <div className="featured-carousel-slide" key={groupKey}>
                  <Row gutter={[24, 24]} justify="center">
                    {group.map((project) => (
                      <Col
                        key={project.id || project.name}
                        xs={24}
                        sm={24}
                        md={8}
                      >
                        <ProjectCard project={project} />
                      </Col>
                    ))}
                  </Row>
                </div>
              );
            })}
          </Carousel>
        )}
      </section>
    </>
  );
}