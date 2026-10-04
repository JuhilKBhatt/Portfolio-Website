// ./client/src/components/Navbar.jsx

import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getNavList } from "../scripts/getNavList";
import "../styles/customHeader.css";

const navItems = getNavList();

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, "") || "/";

  const menuItems = navItems.map(({ key, label, icon: IconComponent }) => ({
    key,
    label,
    icon: IconComponent ? <IconComponent /> : null,
    title: label,
  }));

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <div className="header-name">
      <Menu
        mode="horizontal"
        selectedKeys={[currentPath]}
        onClick={handleMenuClick}
        items={menuItems}
        className="pill-nav-menu"
      />
    </div>
  );
}