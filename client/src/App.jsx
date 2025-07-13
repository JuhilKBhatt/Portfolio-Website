// ./client/App.jsx
import React, { useState, useEffect } from "react";
import { Layout, Flex } from "antd";
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from "./components/Navbar";
import FooterComponent from "./components/Footer";
import { getNavList } from "./scripts/getNavList";
import LoadingScreen from "./components/LoadingScreen";
import "./styles/customApp.css";
import "./styles/customHeader.css";
import "./styles/customFooter.css";

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);
  const [collapsed, setCollapsed] = useState(false);
  const navItems = getNavList();
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 770);
      setCollapsed(width < 968 && width >= 770);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="grid-background" />
      <Flex gap="middle" wrap>
        <Layout className="layoutStyle">
          {/* Header */}          
          <Header>
            <div className="headerStyle">
              <Navbar />
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
            <FooterComponent />
          </Footer>
        </Layout>
      </Flex>
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoading(false);
      return;
    }
    
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