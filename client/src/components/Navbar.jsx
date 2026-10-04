// ./client/src/components/Navbar.jsx

import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getNavList } from "../scripts/getNavList";
import ActiveDot from "./ActiveDot";
import "../styles/customHeader.css";

const navItems = getNavList();

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, "") || "/";

  const menuItems = navItems.map(({ key, label, icon: IconComponent }) => {
    const isActive = currentPath === key;
    return {
      key,
      label: (
        <span className="nav-item-content">
          {isActive && <ActiveDot color="blue" size="sm" className="nav-active-dot" />}
          <span className="nav-label-text">{label}</span>
        </span>
      ),
      icon: (
        <span className="nav-icon-wrapper">
          {isActive && <ActiveDot color="blue" size={5} className="nav-active-dot-mobile" />}
          {IconComponent ? <IconComponent /> : null}
        </span>
      ),
      title: label,
    };
  });

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