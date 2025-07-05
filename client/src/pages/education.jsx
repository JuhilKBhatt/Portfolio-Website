// ./client/src/pages/education.jsx

import React, { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import { extractEducationData } from "../scripts/extractEducationData.js";
import { formatEducationData } from "../scripts/formatEducationData.jsx";

const { Content } = Layout;

export default function Education() {
  const [educationData, setEducationData] = useState(null);
  console.log(extractEducationData);

  useEffect(() => {
    extractEducationData().then((data) => {
      setEducationData(data);
    });
  }, []);

  return (
    <Content style={{ padding: 24 }}>
      {educationData ? formatEducationData(educationData) : <Spin />}
    </Content>
  );
}