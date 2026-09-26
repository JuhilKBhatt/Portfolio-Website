// ./client/src/components/ProjectCard.jsx

import { Card, Carousel, Tag, Tooltip, Row, Col, Image } from "antd";
import {
  GlobalOutlined,
  GithubOutlined,
  VideoCameraOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import "../styles/projectCard.css";
import { useMemo, useState } from "react";

const { Meta } = Card;

const colors = [
  "magenta", "red", "volcano", "orange", "gold",
  "lime", "green", "cyan", "blue", "geekblue", "purple"
];

function getColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function optimizeImageUrl(url, width = 800) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("/upload/f_auto") && !url.includes("/upload/q_auto")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
  }
  return url;
}

function ProjectPlaceholder({ title }) {
  return (
    <div className="project-placeholder">
      <div className="project-placeholder-pattern" />
      <div className="project-placeholder-content">
        <CodeOutlined className="project-placeholder-icon" />
        <span className="project-placeholder-title">{title || "Project Preview"}</span>
      </div>
    </div>
  );
}

function isSafeUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProjectCard({ project }) {
  const info = project?.portfolio_info;
  const isVisible = Boolean(info && info.Visibilty === true);
  const [imageFailed, setImageFailed] = useState(false);

  const filteredImages = useMemo(() => {
    return isVisible ? (info?.images || []).filter(Boolean) : [];
  }, [isVisible, info?.images]);

  const imageContent = useMemo(() => {
    if (!isVisible) return null;

    // Fallback to elegant native placeholder if no images exist or image fails to load
    if (imageFailed || filteredImages.length === 0) {
      return <ProjectPlaceholder title={info?.title || project.name} />;
    }

    if (filteredImages.length > 1) {
      return (
        <Carousel autoplay className="project-carousel">
          {filteredImages.map((url, i) => (
            <Image
              key={url || i}
              src={optimizeImageUrl(url, 800)}
              preview={{ src: optimizeImageUrl(url, 2560) }}
              alt={`${info?.title || project.name} Screenshot ${i + 1}`}
              className="project-image"
              loading="lazy"
              onError={() => setImageFailed(true)}
              style={{ objectFit: 'cover', width: '100%', height: 'auto', aspectRatio: '2/1' }}
            />
          ))}
        </Carousel>
      );
    }

    return (
      <Image
        alt={`${info?.title || project.name} Cover`}
        src={optimizeImageUrl(filteredImages[0], 800)}
        preview={{ src: optimizeImageUrl(filteredImages[0], 2560) }}
        className="project-image"
        loading="lazy"
        onError={() => setImageFailed(true)}
        style={{ objectFit: 'cover', width: '100%', height: 'auto', aspectRatio: '2/1' }}
      />
    );
  }, [isVisible, imageFailed, filteredImages, info?.title, project.name]);

  if (!isVisible) return null;

  return (
    <Card
      className="project-card"
      cover={imageContent}
      actions={[
        isSafeUrl(info.liveDemo) ? (
          <Tooltip title="Live Demo">
            <a href={info.liveDemo} target="_blank" rel="noopener noreferrer">
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
        isSafeUrl(project.html_url) ? (
          <Tooltip title="GitHub Repo">
            <a href={project.html_url} target="_blank" rel="noopener noreferrer">
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
        isSafeUrl(info.videoDemo) ? (
          <Tooltip title="Video Demo">
            <a href={info.videoDemo} target="_blank" rel="noopener noreferrer">
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
            {Array.isArray(info.Highlights) && info.Highlights.length > 0 && (
              <ul className="project-highlights">
                {info.Highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            )}
            <div className="project-tags">
              {info.language?.filter(lang => lang && lang.trim() !== "").map((lang) => (
                <Tag key={lang} color={getColor(lang)}>{lang}</Tag>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
}