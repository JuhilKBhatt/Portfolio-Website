// ./client/App.jsx

import React, { useState, useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { getNavList } from "./scripts/getNavList";
import "./styles/customNav.css";
import "./styles/customHeader.css";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
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

useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setCollapsed(width < 968 && width >= 768);
  };

  // Initial check
  handleResize();
  window.addEventListener("resize", handleResize);

  // Also run handleResize every 1 second
  const interval = setInterval(handleResize, 1000);
  return () => {
    window.removeEventListener("resize", handleResize);
    clearInterval(interval);
  };
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
          <span className="headerTitle">{pageTitle}</span>
        </div>
      </Header>

      {/* Page content */}
      <Content
        style={{
          margin: isMobile ? "12px 8px" : "24px 16px",
          padding: isMobile ? 12 : 24,
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