// ./client/src/scripts/formatEducationData.js

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
            style={{ width: "100%", maxWidth: "700px", wordBreak: "break-word" }}
          >
            <Text strong>Degree:</Text>
            <Paragraph style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
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
          </Card>
        ),
      }))}
    />
  );
}