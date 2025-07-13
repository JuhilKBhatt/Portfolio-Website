// ./client/src/pages/home.jsx

import React from "react";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";
import "../styles/customHomePage.css";

export default function Home() {
  return (
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
  );
}