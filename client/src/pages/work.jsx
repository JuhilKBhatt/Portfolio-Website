// ./client/src/pages/work.jsx

import React, { useEffect, useState } from "react";
import {
  Spin,
  Typography,
  Divider,
  Card,
  Collapse,
} from "antd";
import { extractWorkData } from "../scripts/extractWorkData";
import { formatWorkData } from "../scripts/formatWorkData";
import { DownOutlined } from "@ant-design/icons";
import { groupWorkDurations } from "../scripts/utility";
import "../styles/cardSection.css";

const { Title, Paragraph } = Typography;

export default function Work() {
  const [workData, setWorkData] = useState(null);

  useEffect(() => {
    extractWorkData().then((data) => setWorkData(data));
  }, []);

  return (
    <div className="card-section-container">
      <Card className="card-section">
        <Title level={2} className="card-section-title">
          Work Experience
        </Title>

        {workData ? (
          <>
            {Object.entries(groupWorkDurations(workData)).map(
              ([position, months]) => (
                <Paragraph key={position} className="card-section-paragraph">
                  <strong>{position}:</strong>{" "}
                  {months} month{months !== 1 ? "s" : ""}
                </Paragraph>
              )
            )}

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
          <Spin />
        )}
      </Card>
    </div>
  );
}