// ./client/src/scripts/utility.js

import dayjs from "dayjs";

function cleanDate(str) {
  return (str || "")
    .replace(/[^\d\/]/g, "") // Keep only digits and slash
    .trim();
}

export function groupWorkDurations(entries) {
  const totals = {};

  entries.forEach((entry) => {
    const rawFrom = cleanDate(entry.dateFrom);
    const rawTo = cleanDate(entry.dateTo);

    const fromDate = dayjs(rawFrom, ["MM/YYYY", "M/YYYY"]);
    const toDate = rawTo ? dayjs(rawTo, ["MM/YYYY", "M/YYYY"]) : dayjs();

    if (!fromDate.isValid()) {
      console.warn("Invalid from date:", entry.dateFrom);
      return;
    }
    if (!toDate.isValid()) {
      console.warn("Invalid to date:", entry.dateTo);
      return;
    }

    let duration = toDate.diff(fromDate, "month");
    if (duration <= 0) duration = 1;

    const roles = entry.position.split("+").map((r) => r.trim());

    roles.forEach((role) => {
      totals[role] = (totals[role] || 0) + duration;
    });
  });

  return totals;
}