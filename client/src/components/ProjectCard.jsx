// ./client/src/components/ProjectCard.jsx

import { Card, Tag, Typography, Carousel } from "antd";

const { Title, Paragraph } = Typography;

export default function ProjectCard({ project }) {
  const info = project.portfolio_info;

  if (!info || info.Visibilty === false) return null;

  return (
    <Card
      title={info.title || project.name}
      extra={<a href={project.html_url} target="_blank" rel="noreferrer">GitHub</a>}
      style={{ width: 400, margin: "16px auto" }}
      cover={
        info.images?.length > 0 && (
          <Carousel autoplay>
            {info.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Screenshot ${i}`}
                style={{ maxHeight: 200, objectFit: "cover" }}
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
    </Card>
  );
}