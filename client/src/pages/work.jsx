// ./client/src/pages/work.jsx

import React, { useEffect, useState } from "react";
import { Spin, Typography, Divider } from "antd";
import { extractWorkData } from "../scripts/extractWorkData";
import { formatWorkData } from "../scripts/formatWorkData";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

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
      <Title level={2}>Work Experience</Title>

      {workData ? (
        <>
          {workData.map((entry, idx) => {
            const months = getDurationInMonths(entry.dateFrom, entry.dateTo);
            return (
              <Paragraph key={`${entry.name}-${idx}`} style={{ marginBottom: 4 }}>
                <strong>{entry.name}:</strong> {months} month{months !== 1 ? "s" : ""}
              </Paragraph>
            );
          })}

          <Divider style={{ margin: "16px 0" }} />

          {formatWorkData(workData)}
        </>
      ) : (
        <Spin />
      )}
    </div>
  );
}