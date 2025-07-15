// ./client/src/pages/project.jsx

import { Layout, Spin, Row, Col } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const { projects, loading } = useProjects("juhilkbhatt");

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  } else if (projects.length === 0) {
    content = <p className="text-center">No visible projects to show.</p>;
  } else {
    content = (
      <Row gutter={[24, 24]} justify="center">
        {projects.map((project) => (
          <Col key={project.id || project._id || project.name} xs={24} sm={12} md={8} lg={6}>
            <ProjectCard project={project} />
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Layout.Content className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Projects</h1>
      {content}
    </Layout.Content>
  );
}