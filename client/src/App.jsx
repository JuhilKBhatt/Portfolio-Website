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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        trigger={null}
        collapsible collapsed={collapsed}
        style={{
          background: "#394D65",
          textAlign: "center",
          width: collapsed ? 80 : 200,
        }}>
        <div />
        <Menu
          theme="dark"
          style={{ background: "#394D65" }}
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
        <Header style={{ padding: 0, background: "#FFD700" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "38px", width: 64, height: 64 }}
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
  <Router>
    <AppLayout />
  </Router>
);

export default App;