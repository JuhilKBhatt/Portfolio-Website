// ./client/src/scripts/formatEducationData.js

import { Timeline, Card, Typography, Flex } from "antd";
const { Title, Text, Paragraph } = Typography;

export function formatEducationData(educationEntries) {
  return (
    <Timeline
      mode="left"
      style={{ padding: "24px" }}
      items={educationEntries.map((entry) => ({
        label: `${entry.dateFrom || "?"} - ${entry.dateTo || "Present"}`,
        children: (
          <Flex gap="large" vertical align="stretch">
            {educationEntries.map((entry, idx) => (
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
                      <Text strong>Degree:</Text>
                      <Paragraph style={{ marginBottom: 8 }}>
                        {entry.degree}
                      </Paragraph>
                      {entry.description && entry.description.length > 0 && (
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
            ))}
          </Flex>
        ),
      }))}
    />
  );
}