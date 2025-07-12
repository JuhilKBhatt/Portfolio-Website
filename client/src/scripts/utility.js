// ./client/src/scripts/utility.js

import dayjs from "dayjs";

export function groupWorkDurations(entries) {
  const totals = {};

  entries.forEach((entry) => {
    let fromDate = dayjs(entry.dateFrom, ["MM/YYYY", "M/YYYY"]);
    let toDate =
      entry.dateTo && entry.dateTo.trim()
        ? dayjs(entry.dateTo, ["MM/YYYY", "M/YYYY"])
        : dayjs(); // default to now

    // If parsing failed (invalid date), skip this entry
    if (!fromDate.isValid()) {
      console.warn("Invalid from date:", entry.dateFrom);
      return;
    }

    if (!toDate.isValid()) {
      console.warn("Invalid to date:", entry.dateTo);
      return;
    }

    let duration = toDate.diff(fromDate, "month");
    if (duration <= 0) duration = 1; // fallback if same month or bad diff

    // Split positions by '+' and assign full duration to each
    const roles = entry.position.split("+").map((r) => r.trim());

    roles.forEach((role) => {
      totals[role] = (totals[role] || 0) + duration;
    });
  });

  return totals;
}