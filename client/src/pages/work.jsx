// ./client/src/pages/work.jsx

import React, { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import { extractWorkData } from "../scripts/extractWorkData";
import { formatWorkData } from "../scripts/formatWorkData";

const { Content } = Layout;

export default function Work() {
  const [workData, setWorkData] = useState(null);

  useEffect(() => {
    extractWorkData().then((data) => setWorkData(data));
  }, []);

  return (
    <Content style={{ padding: 24, maxWidth: "100%" }}>
      <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }} >
        {workData ? formatWorkData(workData) : <Spin />}
      </div>
    </Content>
  );
}