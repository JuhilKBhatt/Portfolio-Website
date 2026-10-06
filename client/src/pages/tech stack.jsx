// ./client/src/pages/tech-stack.jsx

import React from "react";
import { Layout } from "antd";
import { useTechStack } from "../hooks/useTechStack";
import RadarGraph from "../components/RadarGraph";

export default function TechStack() {
  const { techStack, categoryData } = useTechStack("juhilkbhatt");

  return (
    <Layout.Content className="tech-stack-container" style={{ padding: "clamp(20px, 4vw, 40px)", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#f3f4f6", fontFamily: "'Lexend', sans-serif" }}>Tech Stack</h1>
      <p style={{ color: "#9ca3af", marginBottom: 24 }}>My go-to tools and technologies for building software across categories.</p>
      <RadarGraph techStack={techStack} categoryData={categoryData} />
    </Layout.Content>
  );
}