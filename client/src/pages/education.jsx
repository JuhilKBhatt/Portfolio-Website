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
  Modal,
  Tooltip,
} from "antd";
import { DownOutlined, FileImageOutlined } from "@ant-design/icons";
import { extractEducationData } from "../scripts/extractEducationData.js";
import { formatEducationData } from "../scripts/formatEducationData.jsx";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/cardSection.css";

const { Title, Paragraph, Text } = Typography;

export default function Education() {
  const [educationData, setEducationData] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    extractEducationData().then((data) => {
      setEducationData(data);
    });
  }, []);

  const openImagePreview = (images) => {
    setPreviewImages(images);
    setIsModalVisible(true);
  };

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
                  <Card hoverable variant="borderless" style={{ borderRadius: 12 }}>
                    <Title level={4}>{entry.name}</Title>
                    <Paragraph type="secondary">{entry.degree}</Paragraph>

                    {entry.description?.length > 0 && (
                      <ul style={{ paddingLeft: 20 }}>
                        {entry.description.map((desc, idx) => (
                          <li key={`${desc}-${idx}`}>
                            <Text>{desc}</Text>
                          </li>
                        ))}
                      </ul>
                    )}

                    {entry.certificate && entry.certificate.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <Tooltip title="View Certificates">
                          <FileImageOutlined
                            style={{ fontSize: 24, cursor: "pointer", color: "#F04B24" }}
                            onClick={() => openImagePreview(entry.certificate)}
                          />
                        </Tooltip>
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

            <Modal
              title="Certificate Gallery"
              open={isModalVisible}
              footer={null}
              onCancel={() => setIsModalVisible(false)}
              width={800}
            >
              <Row gutter={[16, 16]}>
                {previewImages.map((img, index) => (
                  <Col span={12} key={typeof img === "string" ? img : `${img}-${index}`}>
                    <Image
                      src={img}
                      alt={`Certificate ${index + 1}`}
                      width="100%"
                      style={{ borderRadius: 8 }}
                    />
                  </Col>
                ))}
              </Row>
            </Modal>
          </>
        ) : (
          <LoadingScreen />
        )}
      </Card>
    </div>
  );
}