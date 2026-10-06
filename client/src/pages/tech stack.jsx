// ./client/src/pages/tech-stack.jsx

import React from "react";
import { Layout } from "antd";
import { useTechStack } from "../hooks/useTechStack";
import RadarGraph from "../components/RadarGraph";
import PageTitle from "../components/PageTitle";

export default function TechStack() {
  const { techStack, categoryData } = useTechStack("juhilkbhatt");

  return (
    <Layout.Content className="tech-stack-container" style={{ padding: "clamp(20px, 4vw, 40px)", maxWidth: 1200, margin: "0 auto" }}>
      <PageTitle
        tag="CAPABILITIES MATRIX"
        title="Tech Stack"
        subtitle="My go-to tools and technologies for building software across categories."
        meta="5 CORE DISCIPLINES"
      />
      <RadarGraph techStack={techStack} categoryData={categoryData} />
    </Layout.Content>
  );
}