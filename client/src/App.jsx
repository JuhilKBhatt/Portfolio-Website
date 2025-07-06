// ./client/App.jsx

import React, { useState, useEffect } from "react";
import { Layout, Menu, Flex } from "antd";
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, } from "react-router-dom";
import { getNavList } from "./scripts/getNavList";
import "./styles/customApp.css";
import "./styles/customHeader.css";

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = getNavList();
  const currentPath = location.pathname;

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
        <Layout className="layoutStyle">
          {/* Header */}
          <Header className="headerStyle">
            <div className="header-name">
              <a href="/" className="header-link">
                <span>Juhil</span>

                <span className="k-letter">K.</span>
                <span className="k-spacer">....</span>
                <span className="k-caret">^</span>

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
          <Content className="contentStyle">
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
          <Footer className="footerStyle">© {new Date().getFullYear()} Juhil K Bhatt</Footer>
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