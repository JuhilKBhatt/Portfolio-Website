// ./client/App.jsx
import React, { useState, useEffect } from "react";
import { Layout, Menu, Flex, Dropdown } from "antd";
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { getNavList } from "./scripts/getNavList";
import LoadingScreen from "./components/LoadingScreen";
import { GithubOutlined, LinkedinOutlined, MailOutlined } from "@ant-design/icons";
import "./styles/customApp.css";
import "./styles/customHeader.css";
import "./styles/customFooter.css";

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = getNavList();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 770);
      setCollapsed(width < 968 && width >= 770);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    // No need for setInterval here, resize event is sufficient
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItems = navItems.map(({ key, label }) => ({
    key,
    label,
  }));

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setCollapsed(false); // Close the dropdown after clicking an item
  };

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

              {/* Desktop Nav Menu */}
              {!isMobile && (
                <Menu
                  mode="horizontal"
                  selectedKeys={[currentPath]}
                  onClick={handleMenuClick}
                  items={menuItems}
                  className="pill-nav-menu"
                />
              )}

              {/* Mobile Dropdown Menu */}
              {isMobile && (
                <Dropdown
                  open={collapsed}
                  onOpenChange={setCollapsed}
                  menu={{
                    selectedKeys: [currentPath],
                    onClick: handleMenuClick,
                    items: menuItems,
                    className: "mobile-dropdown-menu",
                  }}
                  trigger={["click"]}
                >
                  <button
                    type="button"
                    className={`menu-icon ${collapsed ? "open" : ""}`}
                    aria-label="Open navigation menu"
                    onClick={() => setCollapsed(!collapsed)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setCollapsed(!collapsed);
                      }
                    }}
                  >
                    <span />
                    <span />
                    <span />
                  </button>
                </Dropdown>
              )}
            </div>
          </Header>

          {/* Content */}
          <Content>
            <Routes>
              {navItems.map(({ key, element }) => (
                <Route key={key} path={key} element={React.createElement(element)} />
              ))}
              <Route path="*" element={<div>404: Page Not Found</div>} />
            </Routes>
          </Content>

          {/* Footer */}
          <Footer className="footerStyle">
            <div className="footer-container">
              <div style={{ display: "flex", gap: "12px" }}>
                <a
                  href="https://github.com/JuhilKBhatt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-github-link"
                >
                  <GithubOutlined />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/juhil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-linkedin-link"
                >
                  <LinkedinOutlined />
                  <span>LinkedIn</span>  
                </a>
                <a 
                  href="/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-email-link"
                >
                  <MailOutlined />
                  <span>Email</span>  
                </a>
              </div>
              <span className="footer-text">
                © {new Date().getFullYear()} Juhil Kalpeshkumar Bhatt. All Rights Reserved.
              </span>
            </div>
          </Footer>
        </Layout>
      </Flex>
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <AppLayout />
    </Router>
  );
};


export default App;