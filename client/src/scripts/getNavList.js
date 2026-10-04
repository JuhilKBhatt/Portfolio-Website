// src/scripts/getNavList.js
// This uses Vite's glob import to get all files in pages

import { lazy } from "react";
import Home from "../pages/home.jsx";
import { setNavIcon } from "./setNavIcon.js";
import { AppstoreOutlined } from "@ant-design/icons";

// Helper to format filenames into clean, Title Case labels on the fly
const formatLabel = (fileName) => fileName.replace(/[-_]/g).toUpperCase();

export const getNavList = () => {
  const pages = import.meta.glob([
    "../pages/*.jsx",
    "!../pages/home.jsx"
  ]);

  // Convert the lazy pages object into an array
  const lazyPages = Object.keys(pages).map((path) => {
    const fileName = path.split("/").pop().replace(".jsx", "");
    const fileKey = fileName.toLowerCase();
    const label = formatLabel(fileName);
    const routeSlug = fileKey.replace(/\s+/g, "-");

    return {
      label,
      key: `/${routeSlug}`,
      element: lazy(pages[path]),
      icon:
        setNavIcon[fileKey] ||
        setNavIcon[routeSlug] ||
        setNavIcon[fileKey.replace(/[-_\s]+/g, "")] ||
        AppstoreOutlined,
      fileKey,
    };
  });

  // Eagerly load Home for instant first paint
  const homePage = {
    label: "OVERVIEW",
    key: "/",
    element: Home,
    icon: setNavIcon["home"] || AppstoreOutlined,
    fileKey: "home",
  };

  const pageList = [homePage, ...lazyPages];

  // Sort with Home first, then Projects, then rest alphabetically
  const priority = { home: 0, projects: 1 };

  return pageList.toSorted((a, b) => {
    const aPriority = priority[a.fileKey] ?? 2;
    const bPriority = priority[b.fileKey] ?? 2;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return a.label.localeCompare(b.label);
  });
};
