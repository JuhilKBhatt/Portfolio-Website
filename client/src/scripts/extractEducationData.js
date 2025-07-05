// ./client/src/scripts/extractEducationData.js

export async function extractEducationData() {
  try {
    const response = await fetch("./data/educationPage.txt");
    const text = await response.text();

    const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
    const educationEntriesMap = {};

    for (let line of lines) {
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const [entryIdRaw, fieldKey] = key.split("-");
      const entryId = entryIdRaw.split(".")[0];

      if (!educationEntriesMap[entryId]) {
        educationEntriesMap[entryId] = { entry: entryIdRaw };
      }

      switch (fieldKey) {
        case "Name":
          educationEntriesMap[entryId].name = value;
          break;
        case "DateFrom":
          educationEntriesMap[entryId].dateFrom = value;
          break;
        case "DateTo":
          educationEntriesMap[entryId].dateTo = value;
          break;
        case "Degree":
          educationEntriesMap[entryId].degree = value;
          break;
        case "Description": {
          const items = value.split("\\n").map(desc => desc.trim()).filter(Boolean);
          if (items.length > 0) {
            educationEntriesMap[entryId].description = items;
          }
          break;
        }
      }
    }

    const entries = Object.values(educationEntriesMap);

    const parseDate = (str) => {
      if (!str) return null;
      const [month, year] = str.split("/");
      return new Date(parseInt(year), parseInt(month) - 1);
    };

    entries.sort((a, b) => {
      const aHasNoEnd = !a.dateTo;
      const bHasNoEnd = !b.dateTo;

      if (aHasNoEnd && !bHasNoEnd) return -1; // a is ongoing
      if (!aHasNoEnd && bHasNoEnd) return 1;  // b is ongoing

      const dateA = parseDate(a.dateTo) || parseDate(a.dateFrom);
      const dateB = parseDate(b.dateTo) || parseDate(b.dateFrom);

      return dateB - dateA; // most recent first
    });

    return entries;
  } catch (error) {
    console.error("Failed to extract education data:", error);
    return [];
  }
}