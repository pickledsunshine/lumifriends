/**
 * Display formatting rules — spec §13.
 * Underlying values stay ISO / numeric; only these helpers produce human strings.
 */

/**
 * The prototype is pinned to a fixed "now" so the mock dataset stays coherent
 * (relative labels like "Today, 11:42" would otherwise drift out of the cycle).
 */
export const TODAY_ISO = "2026-07-27";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Parses an ISO date or date-time string as a local (not UTC) date. */
export function parseIso(iso: string): Date {
  const [datePart, timePart] = iso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  if (!timePart) return new Date(year, month - 1, day);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

/** `3400000` → `"3,400,000 VND"` */
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("en-US")} VND`;
}

/** EUR values are indicative only and always read as approximate. */
export function formatApproxEur(amount: number): string {
  return `Approximately €${amount.toLocaleString("en-US")}`;
}

/** `"2026-07-30"` → `"30 July 2026"` */
export function formatLongDate(iso: string): string {
  const date = parseIso(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** `"2026-07-30"` → `"30 July"` */
export function formatDayMonth(iso: string): string {
  const date = parseIso(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** `("2026-07-15", "2026-07-28")` → `"15–28 July 2026"` */
export function formatCycleRange(startIso: string, endIso: string): string {
  const start = parseIso(startIso);
  const end = parseIso(endIso);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${formatDayMonth(startIso)} – ${formatLongDate(endIso)}`;
}

/** Short form for chips and dropdowns: `"15–28 July"` */
export function formatCycleRangeShort(startIso: string, endIso: string): string {
  const start = parseIso(startIso);
  const end = parseIso(endIso);
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]}`;
  }
  return `${formatDayMonth(startIso)} – ${formatDayMonth(endIso)}`;
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

/** `"2026-07-27T11:42:00"` → `"Today, 11:42"` / `"26 Jul 2026, 18:05"` */
export function formatActivationTimestamp(iso: string): string {
  const date = parseIso(iso);
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const today = parseIso(TODAY_ISO);
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (isToday) return `Today, ${time}`;

  const shortMonth = MONTHS[date.getMonth()].slice(0, 3);
  return `${date.getDate()} ${shortMonth} ${date.getFullYear()}, ${time}`;
}
