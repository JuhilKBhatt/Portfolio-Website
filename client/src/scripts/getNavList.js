// src/scripts/getNavList.js
// This uses Vite's glob import to get all files in pages

export const getNavList = () => {
  const pages = import.meta.glob("../pages/*.jsx", { eager: true });

  const pageList = Object.keys(pages).map((path) => {
    const fileName = path.split("/").pop().replace(".jsx", "");
    const label = fileName.charAt(0).toUpperCase() + fileName.slice(1);

    return {
      label,
      path: fileName === "home" ? "/" : `/${fileName.toLowerCase()}`,
      fileName,
      element: pages[path].default,
    };
  });

    // Sort with Home first, then Projects, then rest alphabetically
    const sorted = pageList.toSorted((a, b) => {
    const priority = { home: 0, projects: 1 };
    const aPriority = priority[a.fileName.toLowerCase()] ?? 2;
    const bPriority = priority[b.fileName.toLowerCase()] ?? 2;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return a.label.localeCompare(b.label);
  });

  return sorted;
};
