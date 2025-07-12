// ./src/pages/Home.jsx
import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import "../styles/customHomePage.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Juhil Kalpeshkumar Bhatt</h1>
        <h2>Full-Stack & Software Developer</h2>
        <p>I build scalable, interactive applications using modern web technologies.</p>
        <Button type="primary" size="large">
          <Link to="/projects">View My Work</Link>
        </Button>
      </section>

      {/* About Me Preview */}
      <section className="about-preview">
        <h3>About Me</h3>
        <p>
          I'm a passionate developer based in Australia, currently focused on JavaScript, Python
          and server infrastructure. I enjoy solving problems and creating thoughtful,
          user-friendly experiences. currently working as a manager and IT support at Safari 
          Copper Recycling, where I also created their docket software.
        </p>
      </section>

      {/* Featured Projects */}
      <section className="projects-preview">
        <h3>Featured Projects</h3>
        <div className="project-cards">
          <div className="project-card">
            <h4>Procedural Terrain Generator</h4>
            <p>Three.js + Perlin noise + FBX placement.</p>
            <div className="project-links">

            </div>
          </div>
          <div className="project-card">
            <h4>Echo Puzzle Game</h4>
            <p>Unity puzzle game with time-shifting mechanics.</p>
            <div className="project-links">
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
