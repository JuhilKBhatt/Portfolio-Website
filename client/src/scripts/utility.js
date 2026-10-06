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

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

export function formatWorkDatePill(dateFrom, dateTo) {
  const formatSingle = (str) => {
    if (!str) return "";
    const clean = str.trim();
    if (clean.toLowerCase() === "present") return "PRESENT";
    const parts = clean.split("/");
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10) - 1;
      const y = parts[1];
      if (m >= 0 && m < 12) {
        return `${MONTH_NAMES[m]} ${y}`;
      }
    }
    return clean.toUpperCase();
  };

  const fromStr = formatSingle(dateFrom);
  const toStr = formatSingle(dateTo);
  if (!fromStr && !toStr) return "";
  if (!toStr) return `${fromStr} - PRESENT`;
  if (fromStr === toStr) return fromStr;
  return `${fromStr} - ${toStr}`;
}

export function calculateWorkDuration(dateFrom, dateTo) {
  if (!dateFrom) return "";
  const parseToDayjs = (str) => {
    if (!str || str.toLowerCase() === "present") return dayjs();
    const clean = str.replace(/[^\d/]/g, "").trim();
    return dayjs(clean, ["MM/YYYY", "M/YYYY"]);
  };

  const fromD = parseToDayjs(dateFrom);
  const toD = parseToDayjs(dateTo);
  if (!fromD.isValid() || !toD.isValid()) return "";

  let monthsDiff = toD.diff(fromD, "month");
  if (monthsDiff <= 0) monthsDiff = 1;

  const years = Math.floor(monthsDiff / 12);
  const months = monthsDiff % 12;

  if (years > 0 && months > 0) {
    return `${years} yrs ${months} mos`;
  }
  if (years > 0) {
    return `${years} yr${years > 1 ? "s" : ""}`;
  }
  return `${months} mo${months > 1 ? "s" : ""}`;
}