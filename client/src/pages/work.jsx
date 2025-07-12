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
import dayjs from "dayjs";
import { DownOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

function getDurationInMonths(from, to) {
  const fromDate = dayjs(from, "MM/YYYY");
  const toDate = to ? dayjs(to, "MM/YYYY") : dayjs();

  const months = toDate.diff(fromDate, "month");
  return months === 0 ? 1 : months;
}

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
            {workData.map((entry, idx) => {
              const months = getDurationInMonths(entry.dateFrom, entry.dateTo);
              return (
                <Paragraph
                  key={`${entry.name}-${idx}`}
                  style={{
                    marginBottom: 6,
                    fontSize: "clamp(16px, 1.1vw, 18px)",
                    color: "#333",
                  }}
                >
                  <strong style={{ color: "#F04B24" }}>{entry.name}:</strong>{" "}
                  {months} month{months !== 1 ? "s" : ""}
                </Paragraph>
              );
            })}

            <Divider style={{ margin: "16px 0" }} />

            <Collapse
              accordion
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? 180 : 0} />
              )}
              style={{ backgroundColor: "#fff", borderRadius: "8px" }}
            >
              <Panel header="View Timeline Details" key="1">
                {formatWorkData(workData)}
              </Panel>
            </Collapse>
          </>
        ) : (
          <Spin />
        )}
      </Card>
    </div>
  );
}