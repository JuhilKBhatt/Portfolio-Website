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

    const parsedData = data.map((entry) => {
      let position = entry.position || "";
      let workType = entry.workType || "";

      // Match pattern: "Role Title (Work Type)"
      const match = position.match(/^(.*?)(?:\s*\(([^)]+)\))\s*$/);
      if (match) {
        position = match[1].trim();
        if (!workType) {
          workType = match[2].trim();
        }
      }

      return {
        ...entry,
        rawPosition: entry.position,
        position,
        workType,
      };
    });

    parsedData.sort((a, b) => {
      const dateA = parseDate(a.dateTo) || new Date();
      const dateB = parseDate(b.dateTo) || new Date();
      return dateB - dateA;
    });

    return parsedData;
  } catch (error) {
    console.error("Failed to extract work data:", error);
    return [];
  }
}