// ./client/src/pages/Projects.jsx

import { Layout } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import PageTitle from "../components/PageTitle";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/projects.css";

export default function Projects() {
  const { projects, loading } = useProjects("juhilkbhatt");

  const visibleProjects = projects.filter(
    (p) => p.portfolio_info && p.portfolio_info.Visibilty === true
  );

  let content;
  if (loading) {
    content = <LoadingScreen inline />;
  } else if (visibleProjects.length === 0) {
    content = <p style={{ textAlign: "center" }}>No visible projects to show.</p>;
  } else {
    content = (
      <div className="projects-grid fade-in">
        {visibleProjects.map((project, index) => {
          const key = project.id || project.name || index;
          return (
            <div className="projects-grid-item" key={key}>
              <ProjectCard project={project} index={index} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Layout.Content className="projects-container with-bg">
      <PageTitle
        tag="REPOSITORIES"
        title="Projects"
        subtitle="A showcase of the tools, ideas, and creations I've built from full stack platforms to game prototypes."
        meta={!loading && visibleProjects.length > 0 ? `${visibleProjects.length} ACTIVE BUILDS` : null}
      />
      {content}
    </Layout.Content>
  );
}