// ./client/src/pages/Projects.jsx

import { Layout, Spin } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import "../styles/projects.css";

export default function Projects() {
  const { projects, loading } = useProjects("juhilkbhatt");

  const visibleProjects = projects.filter(
    (p) => p.portfolio_info && p.portfolio_info.Visibilty === true
  );

  let content;
  if (loading) {
    content = (
      <div className="projects-spinner">
        <Spin size="large" />
      </div>
    );
  } else if (visibleProjects.length === 0) {
    content = <p style={{ textAlign: "center" }}>No visible projects to show.</p>;
  } else {
    content = (
      <div className="projects-grid">
        {visibleProjects.map((project) => (
          <div className="projects-grid-item" key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Layout.Content className="projects-container">
      <h1 className="projects-title">Projects</h1>
      {content}
    </Layout.Content>
  );
}