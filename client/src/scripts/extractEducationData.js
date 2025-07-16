// ./client/src/scripts/extractEducationData.js

export async function extractEducationData() {
  try {
    const response = await fetch("data/educationData.json");  // use absolute path
    const data = await response.json();

    const parseDate = (str) => {
      if (!str) return null;
      const [month, year] = str.split("/");
      return new Date(parseInt(year), parseInt(month) - 1);
    };

    data.sort((a, b) => {
      const aHasNoEnd = !a.dateTo;
      const bHasNoEnd = !b.dateTo;

      if (aHasNoEnd && !bHasNoEnd) return -1; // a is ongoing
      if (!aHasNoEnd && bHasNoEnd) return 1;  // b is ongoing

      const dateA = parseDate(a.dateTo) || parseDate(a.dateFrom);
      const dateB = parseDate(b.dateTo) || parseDate(b.dateFrom);

      return dateB - dateA; // most recent first
    });

    return data;
  } catch (error) {
    console.error("Failed to extract education data:", error);
    return [];
  }
}