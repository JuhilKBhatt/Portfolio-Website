// ./client/src/pages/work.jsx

import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Card,
  Collapse,
  Tag,
  Row,
  Col,
} from "antd";
import { extractWorkData } from "../scripts/extractWorkData";
import { formatWorkData } from "../scripts/formatWorkData";
import { groupWorkDurations } from "../scripts/utility";
import { DownOutlined } from "@ant-design/icons";
import "../styles/cardSection.css";
import LoadingScreen from "../components/LoadingScreen";

const { Title, Paragraph, Text } = Typography;

export default function Work() {
  const [workData, setWorkData] = useState(null);

  useEffect(() => {
    extractWorkData().then((data) => setWorkData(data));
  }, []);

  const durations = workData ? groupWorkDurations(workData) : {};

  return (
    <div className="card-section-container">
      <div className="work-header">
        <Title level={2} className="card-section-title">
          Work Experience
        </Title>
        <Paragraph className="work-subtitle">
          A breakdown of roles I've worked in and the time spent in each — from customer support to IT & management.
        </Paragraph>
        <div className="card-section-divider" />
      </div>

      <Card className="card-section fade-in-up" variant="borderless">
        {workData ? (
          <>
            <Row gutter={[16, 16]} className="duration-tag-grid">
              {Object.entries(durations).map(([role, months]) => (
                <Col xs={24} sm={12} md={12} key={role}>
                  <Tag className="duration-tag" color="orange">
                    {role}
                  </Tag>
                  <Text type="secondary">
                    {months} month{months !== 1 ? "s" : ""}
                  </Text>
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
                  children: formatWorkData(workData),
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