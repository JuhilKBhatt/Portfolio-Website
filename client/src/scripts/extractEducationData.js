// ./client/src/scripts/extractEducationData.js

export async function extractEducationData() {
  try {
    const basePath = import.meta.env.BASE_URL || "/";
    const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
    const response = await fetch(`${normalizedBase}data/educationData.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to extract education data:", error);
    return [];
  }
}