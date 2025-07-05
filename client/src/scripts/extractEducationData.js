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
      const entryId = entryIdRaw.split(".")[0]; // group by "1", "2", etc.

      if (!educationEntriesMap[entryId]) {
        educationEntriesMap[entryId] = { entry: entryIdRaw }; // keep first key like 1.0, 2.0
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
        case "Description":
          educationEntriesMap[entryId].description = value
            .split("\\n")
            .map(desc => desc.trim());
          break;
      }
    }

    return Object.values(educationEntriesMap);
  } catch (error) {
    console.error("Failed to extract education data:", error);
    return [];
  }
}