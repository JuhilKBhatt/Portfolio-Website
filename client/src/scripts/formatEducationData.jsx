// ./client/src/scripts/formatEducationData.js

import React from "react";
import { Timeline, Card, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

export function formatEducationData(educationEntries) {
  return (
    <Timeline
      mode="left"
      style={{ padding: "24px" }}
      items={educationEntries.map((entry) => ({
        label: `${entry.dateFrom || "?"} - ${entry.dateTo || "Present"}`,
        children: (
          <Card
            title={<Title level={4}>{entry.name}</Title>}
            variant="borderless"
            style={{ maxWidth: 700 }}
          >
            <Text strong>Degree:</Text>
            <Paragraph>{entry.degree}</Paragraph>

            {entry.description && entry.description.length > 0 && (
              <>
                <Text strong>Description:</Text>
                <ul style={{ paddingLeft: 20 }}>
                  {entry.description.map((item) => (
                    <li key={item}>
                      <Text>{item}</Text>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        ),
      }))}
    />
  );
}