// ./client/App.jsx

import React, { useState, useEffect } from "react";
import { Layout, Menu, Flex } from "antd";
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { getNavList } from "./scripts/getNavList";
import "./styles/customBackground.css";

const { Header, Sider, Content, Footer } = Layout;

const layoutStyle = {
  minHeight: "100vh",
  flex: "1 1 100%",
  background: "transparent",
};

const headerStyle = {
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  padding: "0 16px",
};

const contentStyle = {
  padding: "24px",
  background: "rgba(255, 255, 255, 0.85)",
  minHeight: "280px",
};

const footerStyle = {
  textAlign: "center",
  background: "rgba(0,0,0,0.05)",
  padding: "12px 50px",
};

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = getNavList();
  const currentPath = location.pathname;
  const activePage = navItems.find((item) => item.key === currentPath);
  const pageTitle = activePage?.label || "Page";

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setCollapsed(width < 968 && width >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleResize, 1000);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="grid-background" />
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          {/* Header */}
          <Header style={headerStyle}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              <a href="/">
                <span>Juhil</span>
                <span style={{ margin: "0 8px" }}>K</span>
                <span>Bhatt</span>
              </a>
            </div>

            {/* Desktop Menu */}
            {!isMobile && (
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
            )}

            {/* Mobile Menu */}
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
          </Header>

          {/* Content */}
          <Content style={contentStyle}>
            <Routes>
              {navItems.map(({ key, element }) => (
                <Route
                  key={key}
                  path={key}
                  element={React.createElement(element)}
                />
              ))}
              <Route path="*" element={<div>404: Page Not Found</div>} />
            </Routes>
          </Content>

          {/* Footer */}
          <Footer style={footerStyle}>© {new Date().getFullYear()} Juhil K Bhatt</Footer>
        </Layout>
      </Flex>
    </>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;