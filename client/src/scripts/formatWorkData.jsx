// ./client/src/scripts/formatWorkData.jsx

import React from "react";
import { Timeline, Card, Typography, Flex } from "antd";
const { Title, Text, Paragraph } = Typography;

export function formatWorkData(workEntries) {
  return (
    <Timeline
      mode="left"
      style={{ padding: "24px" }}
      items={workEntries.map((entry) => ({
        label: `${entry.dateFrom || "?"} - ${entry.dateTo || "Present"}`,
        children: (
          <Flex gap="large" vertical align="stretch">
            <Card
              key={entry.name}
              style={{
                width: "100%",
                maxWidth: 700,
                margin: "0 auto",
                wordBreak: "break-word",
                minWidth: 0,
              }}
            >
              <Card.Meta
                description={
                  <div style={{ marginTop: 8 }}>
                    <h2>{entry.name}</h2>
                    <Text strong>Position:</Text>
                    <Paragraph style={{ marginBottom: 8 }}>
                      {entry.position}
                    </Paragraph>

                    {entry.description?.length > 0 && (
                      <>
                        <Text strong>Description:</Text>
                        <ul>
                          {entry.description.map((item) => (
                            <li key={item}>
                              <Text>- {item}</Text>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                }
              />
            </Card>
          </Flex>
        ),
      }))}
    />
  );
}