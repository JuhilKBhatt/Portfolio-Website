// ./client/src/scripts/extractWorkData.js

export async function extractWorkData() {
  try {
    const isGhPages = window.location.hostname.includes("github.io");
    const repoBase = "/Portfolio-Website/";
    const normalizedBase = isGhPages ? repoBase : "/";
    const response = await fetch(`${normalizedBase}data/workData.json`);
    const data = await response.json();

    const parseDate = (str) => {
      if (!str || str.toLowerCase() === "present") return new Date(9999, 11);
      const [month, year] = str.split("/");
      return new Date(parseInt(year, 10), parseInt(month, 10) - 1);
    };

    const defaultColors = ["#ea580c", "#38bdf8", "#a855f7", "#22c55e", "#fb923c", "#3b82f6"];

    const parsedData = (data || []).map((entry, idx) => {
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

      const isPresent =
        !entry.dateTo ||
        entry.dateTo.toLowerCase() === "present" ||
        entry.status === "Active Dispatch";
      const status = entry.status || (isPresent ? "Active Dispatch" : "Concluded Service");

      const themeColor = entry.themeColor || defaultColors[idx % defaultColors.length];

      return {
        id: entry.id || `${(entry.name || "milestone").toLowerCase().replace(/\s+/g, "-")}-${idx}`,
        name: entry.name || "Company",
        rawPosition: entry.position,
        position,
        workType,
        status,
        location: entry.location || "Sydney, NSW",
        dateFrom: entry.dateFrom || "",
        dateTo: entry.dateTo || "Present",
        themeColor,
        bulletIcon:
          entry.bulletIcon ||
          (position.toLowerCase().includes("engineer") || position.toLowerCase().includes("developer")
            ? "code"
            : "arrow"),
        description: Array.isArray(entry.description)
          ? entry.description
          : entry.bullets || [],
        skills: entry.skills || entry.tags || [],
      };
    });

    parsedData.sort((a, b) => {
      const dateA = parseDate(a.dateTo);
      const dateB = parseDate(b.dateTo);
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA;
      }
      return parseDate(b.dateFrom) - parseDate(a.dateFrom);
    });

    return parsedData;
  } catch (error) {
    console.error("Failed to extract work data:", error);
    return [];
  }
}