// ./client/src/components/LoadingScreen.jsx
import React from "react";
import { Spin } from "antd";
import "../styles/loadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <Spin size="large" tip="Loading …" />
    </div>
  );
}