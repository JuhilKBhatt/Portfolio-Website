// ./client/App.jsx

import React from "react";
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
const navItems = getNavList();

const AppLayout = () => {

  return (
    <>
      <div className="grid-background" />
      <Flex gap="middle" wrap>
        <Layout className="layoutStyle">
          {/* Header */}          
          <Header className="header-wrapper">
            <div className="headerStyle">
              <Navbar />
            </div>
          </Header>

          {/* Content */}
          <Content>
            <React.Suspense fallback={<LoadingScreen />}>
              <Routes>
                {navItems.map(({ key, element }) => (
                  <Route key={key} path={key} element={React.createElement(element)} />
                ))}
                <Route path="*" element={<div>404: Page Not Found</div>} />
              </Routes>
            </React.Suspense>
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
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};


export default App;