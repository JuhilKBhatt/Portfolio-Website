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

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export default function Work() {
  const [workData, setWorkData] = useState(null);

  useEffect(() => {
    extractWorkData().then((data) => setWorkData(data));
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{
          borderLeft: "6px solid #F04B24",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: "24px",
          maxWidth: 1000,
          margin: "0 auto",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Title level={2} style={{ color: "#333" }}>
          Work Experience
        </Title>

        {workData ? (
          <>
            {Object.entries(groupWorkDurations(workData)).map(
              ([position, months]) => (
                <Paragraph
                  key={position}
                  style={{
                    marginBottom: 6,
                    fontSize: "clamp(16px, 1.1vw, 18px)",
                    color: "#333",
                  }}
                >
                  <strong style={{ color: "#F04B24" }}>{position}:</strong>{" "}
                  {months} month{months !== 1 ? "s" : ""}
                </Paragraph>
              )
            )}

            <Divider style={{ margin: "16px 0" }} />

            <Collapse
              accordion
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
              style={{ backgroundColor: "#fff", borderRadius: "8px" }}
            />
          </>
        ) : (
          <Spin />
        )}
      </Card>
    </div>
  );
}