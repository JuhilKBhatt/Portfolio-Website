// ./client/src/pages/education.jsx

import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Card,
  Collapse,
  Image,
  Row,
  Col,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { extractEducationData } from "../scripts/extractEducationData.js";
import { formatEducationData } from "../scripts/formatEducationData.jsx";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/cardSection.css";

const { Title, Paragraph, Text } = Typography;

export default function Education() {
  const [educationData, setEducationData] = useState(null);

  useEffect(() => {
    extractEducationData().then((data) => {
      setEducationData(data);
    });
  }, []);

  return (
    <div className="card-section-container">
      <div className="work-header">
        <Title level={2}>Education</Title>
        <Paragraph className="work-subtitle">
          A summary of my academic background, qualifications, and certifications that shaped my journey.
        </Paragraph>
        <div className="card-section-divider" />
      </div>

      <Card className="card-section fade-in-up" variant="borderless">
        {educationData ? (
          <>
            <Row gutter={[24, 24]}>
              {educationData.map((entry) => (
                <Col xs={24} sm={24} md={12} key={entry.id || entry.name}>
                  <Card hoverable bordered={false} style={{ borderRadius: 12 }}>
                    <Title level={4}>{entry.name}</Title>
                    <Paragraph type="secondary">{entry.degree}</Paragraph>

                    {entry.description?.length > 0 && (
                      <ul style={{ paddingLeft: 20 }}>
                        {entry.description.map((desc) => (
                          <li key={desc}>
                            <Text>{desc}</Text>
                          </li>
                        ))}
                      </ul>
                    )}

                    {entry.certificate && (
                      <div style={{ marginTop: 12 }}>
                        <Text strong>Certificate Preview:</Text>
                        <div style={{ marginTop: 8 }}>
                          <Image
                            src={entry.certificate}
                            alt={`${entry.name} Certificate`}
                            width={240}
                            height={160}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            placeholder
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider className="card-section-divider" />

            <Collapse
              accordion
              className="card-section-collapse"
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? 180 : 0} />
              )}
              items={[
                {
                  key: "1",
                  label: "View Timeline Details",
                  children: formatEducationData(educationData),
                },
              ]}
            />
          </>
        ) : (
          <LoadingScreen />
        )}
      </Card>
    </div>
  );
}