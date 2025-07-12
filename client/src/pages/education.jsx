// ./client/src/pages/education.jsx

import React, { useEffect, useState } from "react";
import {
  Spin,
  Typography,
  Divider,
  Card,
  Collapse
} from "antd";
import { extractEducationData } from "../scripts/extractEducationData.js";
import { formatEducationData } from "../scripts/formatEducationData.jsx";
import { DownOutlined } from "@ant-design/icons";
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
      <Card className="card-section" style={{ maxWidth: 800, margin: "0 auto" }}>
        <Title level={2} className="card-section-title">
          Education
        </Title>

        {educationData ? (
          <>
            {educationData.map((entry) => (
              <div className="card-section-paragraph" key={entry.id || entry.name} style={{ marginBottom: "24px" }}>
                <Paragraph strong>{entry.name}</Paragraph>

                {entry.degree && (
                  <Paragraph>
                    <Text strong>Degree:</Text> {entry.degree}
                  </Paragraph>
                )}

                {entry.description?.length > 0 && (
                  <ul style={{ paddingLeft: "20px", marginBottom: "8px" }}>
                    {entry.description.map((desc) => (
                      <li key={desc}>
                        <Paragraph style={{ marginBottom: 4 }}>{desc}</Paragraph>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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