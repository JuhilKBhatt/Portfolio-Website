// ./client/src/pages/project.jsx

import { Layout, Spin, Row, Col } from "antd";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const { projects, loading } = useProjects("juhilkbhatt");

  return (
    <Layout.Content className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {projects.map((project, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
      )}
    </Layout.Content>
  );
}