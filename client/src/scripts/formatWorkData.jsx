// ./client/src/scripts/formatWorkData.jsx

import { Timeline, Card, Typography } from "antd";
const { Title, Text, Paragraph } = Typography;

export function formatWorkData(workEntries) {
  return (
    <Timeline
      mode="left"
      style={{ padding: "24px" }}
      items={workEntries.map((entry) => ({
        label: `${entry.dateFrom || "?"} - ${entry.dateTo || "Present"}`,
        children: (
          <Card
            title={<Title level={4}>{entry.name}</Title>}
            variant="borderless"
            style={{ maxWidth: 700 }}
          >
            <Text strong>Position:</Text>
            <Paragraph>{entry.position}</Paragraph>

            {entry.description?.length > 0 && (
              <>
                <Text strong>Description:</Text>
                <ul style={{ paddingLeft: 20 }}>
                  {entry.description.map((item, index) => (
                    <li key={index}>
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