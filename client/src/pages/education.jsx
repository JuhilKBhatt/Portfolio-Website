// ./client/src/pages/education.jsx

import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { extractEducationData } from "../scripts/extractEducationData.js";
import { formatEducationData } from "../scripts/formatEducationData.jsx";

export default function Education() {
  const [educationData, setEducationData] = useState(null);

  useEffect(() => {
    extractEducationData().then((data) => {
      setEducationData(data);
    });
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }} >
      {educationData ? formatEducationData(educationData) : <Spin />}
    </div>
  );
}