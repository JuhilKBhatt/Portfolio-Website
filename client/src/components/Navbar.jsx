// ./client/src/components/Navbar.jsx

import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
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
  const navWrapperRef = useRef(null);

  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const updateIndicator = useCallback(() => {
    if (!navWrapperRef.current) return;
    const selectedItem = navWrapperRef.current.querySelector(".ant-menu-item-selected");
    if (selectedItem) {
      const wrapperRect = navWrapperRef.current.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();
      setIndicator({
        left: itemRect.left - wrapperRect.left,
        top: itemRect.top - wrapperRect.top,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      });
    }
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
    const frameId = requestAnimationFrame(updateIndicator);
    const timer = setTimeout(updateIndicator, 80);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [currentPath, updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

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

  const handleMenuClick = ({ key, domEvent }) => {
    // Instantly initiate sliding animation on click
    const nativeEvent = domEvent?.domEvent || domEvent;
    const clickedEl =
      nativeEvent?.currentTarget?.closest?.(".ant-menu-item") ||
      navWrapperRef.current?.querySelector(`[data-menu-id*="${key}"]`);

    if (clickedEl && navWrapperRef.current) {
      const wrapperRect = navWrapperRef.current.getBoundingClientRect();
      const itemRect = clickedEl.getBoundingClientRect();
      setIndicator({
        left: itemRect.left - wrapperRect.left,
        top: itemRect.top - wrapperRect.top,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      });
    }

    navigate(key);
  };

  return (
    <div className="header-name">
      <div className="pill-nav-wrapper" ref={navWrapperRef}>
        <div
          className="nav-sliding-indicator"
          style={{
            transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
            width: `${indicator.width}px`,
            height: `${indicator.height}px`,
            opacity: indicator.opacity,
          }}
          aria-hidden="true"
        />
        <Menu
          mode="horizontal"
          selectedKeys={[currentPath]}
          onClick={handleMenuClick}
          items={menuItems}
          className="pill-nav-menu"
        />
      </div>
    </div>
  );
}