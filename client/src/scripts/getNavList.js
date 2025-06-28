// src/scripts/getNavList.js
// This uses Vite's glob import to get all files in pages

export const getNavList = () => {
  const pages = import.meta.glob("../pages/*.jsx", { eager: true });

  return Object.keys(pages).map((path) => {
    const fileName = path.split("/").pop().replace(".jsx", "");
    const label = fileName.charAt(0).toUpperCase() + fileName.slice(1);

    return {
      label: label,
      path: fileName === "home" ? "/" : `/${fileName}`,
      element: pages[path].default,
    };
  });
};
