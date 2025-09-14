// ./client/src/components/Navbar.jsx

import React, { useEffect, useState } from "react";
import { Menu, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getNavList } from "../scripts/getNavList";
import "../styles/customHeader.css";

export default function Navbar() {
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = navItems.map(({ key, label }) => ({
    key,
    label,
  }));

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setCollapsed(false);
  };

  return (
    <div className="header-name">
      <a href="/#/" className="header-link">
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
  );
}