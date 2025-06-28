// src/scripts/getNavList.js
// This uses Vite's glob import to get all files in pages

import { setNavIcon } from "./setNavIcon.js";

export const getNavList = () => {
  const pages = import.meta.glob("../pages/*.jsx", { eager: true });

  const pageList = Object.keys(pages).map((path) => {
    const fileName = path.split("/").pop().replace(".jsx", "");
    const label = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    const fileKey = fileName.toLowerCase();

    return {
      label,
      key: fileKey === "home" ? "/" : `/${fileKey}`, // ✅ this will be used by Menu
      element: pages[path].default,
      icon: setNavIcon[fileKey],
      fileKey,
    };
  });

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
