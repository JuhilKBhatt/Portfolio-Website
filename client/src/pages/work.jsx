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
import { groupWorkDurations, formatDuration } from "../scripts/utility";
import { DownOutlined } from "@ant-design/icons";
import "../styles/cardSection.css";
import LoadingScreen from "../components/LoadingScreen";
import PageTitle from "../components/PageTitle";

const { Title, Paragraph, Text } = Typography;

export default function Work() {
  const [workData, setWorkData] = useState(null);

  useEffect(() => {
    extractWorkData().then((data) => setWorkData(data));
  }, []);

  const durations = workData ? groupWorkDurations(workData) : {};

  return (
    <div className="card-section-container">
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <PageTitle
          tag="CAREER LOG"
          title="Work Experience"
          subtitle="A breakdown of roles I've worked in and the time spent in each - from customer support to IT & management."
          meta="PRODUCTION VERIFIED"
        />
      </div>

      <Card className="card-section fade-in-up" variant="borderless">
        {workData ? (
          <>
            <Row gutter={[16, 16]} className="duration-tag-grid">
              {Object.entries(durations).map(([role, months]) => (
                <Col xs={24} sm={12} md={12} key={role} className="duration-col">
                  <Tag className="duration-tag" color="orange">
                    {role}
                  </Tag>
                  <Text type="secondary" className="duration-text">
                    {formatDuration(months)}
                  </Text>
                </Col>
              ))}
            </Row>

            <Divider className="card-section-divider" />

            <Collapse
              accordion
              defaultActiveKey={["1"]}
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
          <LoadingScreen inline />
        )}
      </Card>
    </div>
  );
}