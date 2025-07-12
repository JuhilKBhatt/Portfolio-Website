// ./client/src/scripts/utility.js

import dayjs from "dayjs";

export function groupWorkDurations(entries) {
  const totals = {};

  entries.forEach((entry) => {
    const fromDate = dayjs(entry.dateFrom, "MM/YYYY");
    const toDate = entry.dateTo ? dayjs(entry.dateTo, "MM/YYYY") : dayjs();

    let duration = toDate.diff(fromDate, "month");
    if (duration === 0) duration = 1;

    // Split positions by "+" and trim whitespace
    const roles = entry.position.split("+").map(role => role.trim());

    // Distribute full duration to each role
    roles.forEach((role) => {
      if (totals[role]) {
        totals[role] += duration;
      } else {
        totals[role] = duration;
      }
    });
  });

  return totals;
}