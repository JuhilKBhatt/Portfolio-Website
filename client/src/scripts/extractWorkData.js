// ./client/src/scripts/extractWorkData.js

export async function extractWorkData() {
  try {
    const response = await fetch("./data/workPage.txt");
    const text = await response.text();

    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    const workEntriesMap = {};

    for (let line of lines) {
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const [entryIdRaw, fieldKey] = key.split("-");
      const entryId = entryIdRaw.split(".")[0];

      if (!workEntriesMap[entryId]) {
        workEntriesMap[entryId] = { entry: entryIdRaw };
      }

      switch (fieldKey) {
        case "Name":
          workEntriesMap[entryId].name = value;
          break;
        case "DateFrom":
          workEntriesMap[entryId].dateFrom = value;
          break;
        case "DateTo":
          workEntriesMap[entryId].dateTo = value;
          break;
        case "Position":
          workEntriesMap[entryId].position = value;
          break;
        case "Description":
          workEntriesMap[entryId].description = value
            .split("\\n")
            .map((desc) => desc.trim())
            .filter(Boolean);
          break;
      }
    }

    const entries = Object.values(workEntriesMap);

    const parseDate = (str) => {
      if (!str) return null;
      const [month, year] = str.split("/");
      return new Date(parseInt(year), parseInt(month) - 1);
    };

    entries.sort((a, b) => {
      const dateA = parseDate(a.dateTo) || new Date();
      const dateB = parseDate(b.dateTo) || new Date();
      return dateB - dateA;
    });

    return entries;
  } catch (error) {
    console.error("Failed to extract work data:", error);
    return [];
  }
}