// ./client/App.jsx

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { getNavList } from "./scripts/getNavList";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navItems = getNavList();
  console.log("Navigation Items:", navItems);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={navItems.map(({ key, label, icon }) => ({
            key,
            icon: React.createElement(icon),
            label,
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
        <Routes>
          {navItems.map(({ key, element }) => (
            <Route key={key} path={key} element={React.createElement(element)} />
          ))}
          <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

// Wrap with Router
const App = () => (
  <Router basename="/Portfolio-Website">
    <AppLayout />
  </Router>
);

export default App;