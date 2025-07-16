// ./client/src/scripts/extractWorkData.js

export async function extractWorkData() {
  try {
    const response = await fetch("data/workData.json");
    const data = await response.json();

    const parseDate = (str) => {
      if (!str) return null;
      const [month, year] = str.split("/");
      return new Date(parseInt(year), parseInt(month) - 1);
    };

    data.sort((a, b) => {
      const dateA = parseDate(a.dateTo) || new Date();
      const dateB = parseDate(b.dateTo) || new Date();
      return dateB - dateA;
    });

    return data;
  } catch (error) {
    console.error("Failed to extract work data:", error);
    return [];
  }
}