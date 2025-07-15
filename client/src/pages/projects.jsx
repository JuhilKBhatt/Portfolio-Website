// ./client/src/pages/project.jsx

import { Layout, Spin, Row, Col } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const { projects, loading } = useProjects("juhilkbhatt");

  return (
    <Layout.Content className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Projects</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-center">No visible projects to show.</p>
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {projects.map((project, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
      )}
    </Layout.Content>
  );
}