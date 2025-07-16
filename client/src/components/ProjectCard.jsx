// ./client/src/components/ProjectCard.jsx

import { Card, Carousel, Tag, Tooltip, Row, Col } from "antd";
import {
  GlobalOutlined,
  GithubOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

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
      // Style is updated to be responsive within its grid container
      style={{ width: '100%', maxWidth: 360, margin: "0 auto" }}
      cover={
        filteredImages.length > 1 ? (
          <Carousel autoplay>
            {filteredImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Screenshot ${i}`}
                style={{
                  height: 200, // Changed maxHeight to height for consistency
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            ))}
          </Carousel>
        ) : (
          <img
            alt="Project Cover"
            src={mainImage}
            style={{
              height: 200, // Changed maxHeight to height for consistency
              objectFit: "cover",
              width: "100%",
            }}
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
            <span style={{ opacity: 0.3, cursor: "not-allowed" }}>
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
            <span style={{ opacity: 0.3, cursor: "not-allowed" }}>
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
            <span style={{ opacity: 0.3, cursor: "not-allowed" }}>
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
            <div style={{ marginBottom: 8, minHeight: 66 }}> {/* Added minHeight for consistency */}
              {info.description || project.description}
            </div>
            <div style={{minHeight: 30}}> {/* Added minHeight for consistency */}
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