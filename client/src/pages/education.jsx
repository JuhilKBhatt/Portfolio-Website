// ./client/src/pages/education.jsx

import { Layout } from "antd";
import { extractEducationData } from "../scripts/extractEducationData";

export default function Education() {
  console.log(extractEducationData());
  return (
    <Layout.Content className="p-4">
      <h1 className="text-2xl font-bold mb-4">Education Page</h1>
      <p>This is the education page content.</p>
    </Layout.Content>
  );
}