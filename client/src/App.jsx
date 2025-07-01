// ./client/App.jsx

import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 968);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navItems = getNavList();
  const currentPath = location.pathname;
  const activePage = navItems.find(item => item.key === currentPath);
  const pageTitle = activePage?.label || "Page";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 968) {
        setCollapsed(true);
        if (window.innerWidth < 768) {
          setIsMobile(true);
          setCollapsed(false);
        }else {
          setIsMobile(false);
          setCollapsed(true);
        }
      }
      else {
        setCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

return (
  <Layout style={{ minHeight: "100vh", height: "auto" }}>
    {/* Sidebar for desktop */}
    {!isMobile && (
      <Sider
        className="custom-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
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
    )}

    <Layout>
      {/* Mobile top menu */}
      {isMobile && !collapsed && (
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPath]}
          onClick={({ key }) => {
            setCollapsed(true);
            navigate(key);
          }}
          items={navItems.map(({ key, label, icon }) => ({
            key,
            icon: React.createElement(icon),
            label: <span>{label}</span>,
          }))}
          style={{ width: "100%" }}
        />
      )}

      {/* Header with title and toggle */}
      <Header className="custom-header">
        <div className="header-inner">
          <Button
            className="headerMenuButton"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginRight: 16 }}
          />
          <span className="headerTitle">{pageTitle}</span>
        </div>
      </Header>

      {/* Page content */}
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          overflowX: "auto",
          overflowY: "auto",
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