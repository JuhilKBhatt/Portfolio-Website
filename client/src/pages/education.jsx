// ./client/src/pages/education.jsx

import React, { useEffect, useState } from "react";
import {
  Spin,
  Typography,
  Divider,
  Card,
  Collapse,
} from "antd";
import { extractEducationData } from "../scripts/extractEducationData.js";
import { formatEducationData } from "../scripts/formatEducationData.jsx";
import { DownOutlined } from "@ant-design/icons";
import "../styles/cardSection.css";

const { Title, Paragraph } = Typography;

export default function Education() {
  const [educationData, setEducationData] = useState(null);

  useEffect(() => {
    extractEducationData().then((data) => {
      setEducationData(data);
    });
  }, []);

  // Optional: you could group/summarize education durations or counts here
  // For example, count number of degrees or schools
  // Here is a simple example of counting how many entries per degree:
  const degreeCounts = educationData
    ? educationData.reduce((acc, entry) => {
        const degree = entry.degree || "Other";
        acc[degree] = (acc[degree] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className="card-section-container">
      <Card className="card-section" style={{ maxWidth: 800, margin: "0 auto" }}>
        <Title level={2} className="card-section-title">
          Education
        </Title>

        {educationData ? (
          <>
            {Object.entries(degreeCounts).map(([degree, count]) => (
              <Paragraph key={degree} className="card-section-paragraph">
                <strong>{degree}:</strong> {count} entr{count === 1 ? "y" : "ies"}
              </Paragraph>
            ))}

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
          <Spin />
        )}
      </Card>
    </div>
  );
}