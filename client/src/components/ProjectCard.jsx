// ./client/src/components/ProjectCard.jsx
import { Card, Tag, Typography, Carousel } from "antd";

const { Paragraph } = Typography;

export default function ProjectCard({ project }) {
  const info = project.portfolio_info;

  if (!info || info.Visibilty === false) return null;

  const filteredImages = (info.images || []).filter(Boolean);

  return (
    <Card
      title={info.title || project.name}
      extra={
        <a href={project.html_url} target="_blank" rel="noreferrer">
          GitHub
        </a>
      }
      style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
      cover={
        filteredImages.length > 0 && (
          <Carousel autoplay>
            {filteredImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Screenshot ${i}`}
                style={{ maxHeight: 200, objectFit: "cover", borderRadius: "8px 8px 0 0" }}
              />
            ))}
          </Carousel>
        )
      }
    >
      <Paragraph>{info.description || project.description}</Paragraph>

      <div style={{ marginTop: 12 }}>
        {info.language?.map((lang) => (
          <Tag key={lang}>{lang}</Tag>
        ))}
        {info.version && <Tag color="blue">v{info.version}</Tag>}
        {info.type && <Tag color="geekblue">{info.type}</Tag>}
      </div>

      {info.liveDemo && (
        <a
          href={info.liveDemo}
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-block", marginTop: 10 }}
        >
          Live Demo
        </a>
      )}

      {info.videoDemo && (
        <video
          src={info.videoDemo}
          controls
          style={{ width: "100%", marginTop: 12, borderRadius: 8 }}
        />
      )}
    </Card>
  );
}