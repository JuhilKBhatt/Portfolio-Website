// ./client/App.jsx

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { getNavList } from "./scripts/getNavList";
import "./styles/customNav.css"; // Custom styles for the navigation
import "./styles/customHeader.css"; // Custom styles for the header

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navItems = getNavList();

  const currentPath = location.pathname;
  const activePage = navItems.find(item => item.key === currentPath);
  const pageTitle = activePage?.label || "Page";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        className="custom-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
        >
        <div />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPath]}
          onClick={({ key }) => navigate(key)}
          items={navItems.map(({ key, label, icon }) => ({
            key,
            icon: React.createElement(icon),
            label: <span>{label}</span>,
          }))}
        />
      </Sider>
      <Layout>
        <Header className="custom-header">
          <div className="header-inner">
            <Button
              className="headerMenuButton"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <div className="headerTitleWrapper">
              <span className="headerTitle">{pageTitle}</span>
            </div>
          </div>
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