// ./client/src/components/ProjectCard.jsx

import { Card, Carousel, Tag, Tooltip, Row, Col } from "antd";
import {
  GlobalOutlined,
  GithubOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "../styles/projectCard.css";
import { useMemo } from "react";

const { Meta } = Card;

function optimizeImageUrl(url, width = 800) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("/upload/f_auto") && !url.includes("/upload/q_auto")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
  }
  return url;
}

export default function ProjectCard({ project }) {
  const info = project?.portfolio_info;
  const isVisible = Boolean(info && info.Visibilty === true);

  const filteredImages = useMemo(() => {
    return isVisible ? (info?.images || []).filter(Boolean) : [];
  }, [isVisible, info?.images]);

  const mainImage = filteredImages[0] || "https://via.placeholder.com/400x200?text=No+Preview";

  const imageContent = useMemo(() => {
    if (!isVisible) return null;
    if (filteredImages.length > 1) {
      return (
        <Carousel autoplay className="project-carousel">
          {filteredImages.map((url, i) => (
            <img
              key={url || i}
              src={optimizeImageUrl(url, 800)}
              alt={`Screenshot ${i}`}
              className="project-image"
              width={400}
              height={200}
              loading="lazy"
              decoding="async"
              style={{ objectFit: 'cover', width: '100%', height: 'auto', aspectRatio: '2/1' }}
            />
          ))}
        </Carousel>
      );
    } else {
      return (
        <img
          alt="Project Cover"
          src={optimizeImageUrl(mainImage, 800)}
          className="project-image"
          width={400}
          height={200}
          loading="lazy"
          decoding="async"
          style={{ objectFit: 'cover', width: '100%', height: 'auto', aspectRatio: '2/1' }}
        />
      );
    }
  }, [isVisible, filteredImages, mainImage]);

  if (!isVisible) return null;

  return (
    <Card
      className="project-card"
      cover={imageContent}
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