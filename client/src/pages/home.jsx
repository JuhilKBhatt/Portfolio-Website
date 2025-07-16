// ./client/src/pages/home.jsx

import React, { useMemo } from "react";
import { Button, Carousel, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import "../styles/customHomePage.css";

export default function Home() {
  const { projects } = useProjects("juhilkbhatt");

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
          <div className="hero-img-lines">
            <img className="AvatarImg" src="img/AvatarImg.png" alt="img" />
            <div className="vertical-line left-line" />
            <div className="vertical-line right-line" />
            <div className="horizontal-line" />
          </div>
        </div>
        <div className="hero-text">
          <h1>Hello There I'm Juhil.</h1>
          <h2>Full-Stack Developer & Software Engineer</h2>
          <p>I build scalable, interactive applications using modern web technologies.</p>
          <Button type="primary" size="large">
            <Link to="/projects">View My Work</Link>
          </Button>
        </div>
      </section>

      {/* Featured Projects */}
      {groupedProjects.length > 0 && (
        <section className="featured-projects">
          <div className="featured-header">
            <h2>Featured Projects</h2>
            <p>Some highlights from my portfolio</p>
          </div>

          <Carousel autoplay dots>
            {groupedProjects.map((group, index) => (
              <div className="featured-carousel-slide" key={index}>
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
            ))}
          </Carousel>
        </section>
      )}
    </>
  );
}