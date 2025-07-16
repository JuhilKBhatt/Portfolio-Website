// ./client/src/pages/Projects.jsx

import { Layout, Spin } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import "../styles/projects.css";
import LoadingScreen from "../components/LoadingScreen";

export default function Projects() {
  const { projects, loading } = useProjects("juhilkbhatt");

  const visibleProjects = projects.filter(
    (p) => p.portfolio_info && p.portfolio_info.Visibilty === true
  );

  let content;
  if (loading) {
    content = <LoadingScreen />;
  } else if (visibleProjects.length === 0) {
    content = <p style={{ textAlign: "center" }}>No visible projects to show.</p>;
  } else {
    content = (
      <div className="projects-grid">
        {visibleProjects.map((project, index) => {
          const key = project.id || project.name || index; // fallback in case `id` is missing
          return (
            <div className="projects-grid-item" key={key}>
              <ProjectCard project={project} />
            </div>
          );
        })}
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