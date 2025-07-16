// ./client/src/components/ProjectCard.jsx

import { Card, Carousel, Tag, Tooltip, Row, Col } from "antd";
import {
  GlobalOutlined,
  GithubOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "../styles/projectCard.css";

const { Meta } = Card;

export default function ProjectCard({ project }) {
  const info = project.portfolio_info;

  if (!info || info.Visibilty !== true) {
    return null;
  }

  const filteredImages = (info.images || []).filter(Boolean);
  const mainImage =
    filteredImages[0] ||
    "https://via.placeholder.com/400x200?text=No+Preview";

  return (
    <Card
      className="project-card"
      cover={
        filteredImages.length > 1 ? (
          <Carousel autoplay className="project-carousel">
            {filteredImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Screenshot ${i}`}
                className="project-image"
              />
            ))}
          </Carousel>
        ) : (
          <img
            alt="Project Cover"
            src={mainImage}
            className="project-image"
          />
        )
      }
      actions={[
        info.liveDemo ? (
          <Tooltip title="Live Demo">
            <a href={info.liveDemo} target="_blank" rel="noreferrer">
              <GlobalOutlined />
            </a>
          </Tooltip>
        ) : (
          <Tooltip title="No Live Demo">
            <span className="disabled-icon">
              <GlobalOutlined />
            </span>
          </Tooltip>
        ),
        project.html_url ? (
          <Tooltip title="GitHub Repo">
            <a href={project.html_url} target="_blank" rel="noreferrer">
              <GithubOutlined />
            </a>
          </Tooltip>
        ) : (
          <Tooltip title="No GitHub URL">
            <span className="disabled-icon">
              <GithubOutlined />
            </span>
          </Tooltip>
        ),
        info.videoDemo ? (
          <Tooltip title="Video Demo">
            <a href={info.videoDemo} target="_blank" rel="noreferrer">
              <VideoCameraOutlined />
            </a>
          </Tooltip>
        ) : (
          <Tooltip title="No Video Demo">
            <span className="disabled-icon">
              <VideoCameraOutlined />
            </span>
          </Tooltip>
        ),
      ]}
    >
      <Meta
        title={
          <Row justify="space-between" align="middle">
            <Col>{info.title || project.name}</Col>
            {info.version && (
              <Col>
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  v{info.version}
                </Tag>
              </Col>
            )}
          </Row>
        }
        description={
          <div>
            <div className="project-description">
              {info.description || project.description}
            </div>
            <div className="project-tags">
              {info.language?.map((lang) => (
                <Tag key={lang}>{lang}</Tag>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
}