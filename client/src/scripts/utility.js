// ./client/src/scripts/utility.js

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

function cleanDate(str) {
  return (str || "").replace(/[^\d/]/g, "").trim();
}

export function formatDuration(totalMonths) {
  if (!totalMonths || totalMonths <= 0) return "0 mos";

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `${years} yr${years > 1 ? "s" : ""}, ${months} mo${months > 1 ? "s" : ""}`;
  }
  if (years > 0) {
    return `${years} yr${years > 1 ? "s" : ""}`;
  }
  return `${months} mo${months > 1 ? "s" : ""}`;
}

export function groupWorkDurations(entries) {
  const totals = {};

  entries.forEach((entry) => {
    const rawFrom = cleanDate(entry.dateFrom);
    const rawTo = cleanDate(entry.dateTo);

    const fromDate = dayjs(rawFrom, ["MM/YYYY", "M/YYYY"]);
    const toDate = rawTo ? dayjs(rawTo, ["MM/YYYY", "M/YYYY"]) : dayjs();

    let duration = toDate.diff(fromDate, "month");
    if (duration <= 0) duration = 1;

    const cleanPosition = (entry.position || "").replace(/\s*\([^)]*\)/g, "").trim();
    const roles = cleanPosition.split("+").map((r) => r.trim());

    roles.forEach((role) => {
      totals[role] = (totals[role] || 0) + duration;
    });
  });

  return totals;
}