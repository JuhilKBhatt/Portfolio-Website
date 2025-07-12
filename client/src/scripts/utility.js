// ./client/src/scripts/utility.js

import dayjs from "dayjs";

export function groupWorkDurations(entries) {
  const totals = {};

  entries.forEach((entry) => {
    const fromDate = dayjs(entry.dateFrom, "MM/YYYY", true); // strict
    const toDate = entry.dateTo
      ? dayjs(entry.dateTo, "MM/YYYY", true)
      : dayjs();

    // Handle invalid dates
    if (!fromDate.isValid() || !toDate.isValid()) return;

    let duration = toDate.diff(fromDate, "month");
    if (duration === 0) duration = 1;

    const roles = entry.position.split("+").map((role) => role.trim());

    roles.forEach((role) => {
      totals[role] = (totals[role] || 0) + duration;
    });
  });

  return totals;
}