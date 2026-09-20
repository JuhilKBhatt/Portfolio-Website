// src/scripts/getNavList.js
// This uses Vite's glob import to get all files in pages

import { lazy } from "react";
import Home from "../pages/home.jsx";
import { setNavIcon } from "./setNavIcon.js";

export const getNavList = () => {
  const pages = import.meta.glob([
    "../pages/*.jsx",
    "!../pages/home.jsx"
  ]);

  // Convert the lazy pages object into an array
  const lazyPages = Object.keys(pages).map((path) => {
    const fileName = path.split("/").pop().replace(".jsx", "");
    const label = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    const fileKey = fileName.toLowerCase();

    return {
      label,
      key: `/${fileKey}`,
      element: lazy(pages[path]),
      icon: setNavIcon[fileKey],
      fileKey,
    };
  });

  // Eagerly load Home for instant first paint
  const homePage = {
    label: "Home",
    key: "/",
    element: Home,
    icon: setNavIcon["home"],
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
