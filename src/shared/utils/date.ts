export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount * 24 * 60 * 60 * 1000);
}

/** Shifts a `YYYY-MM-DD` key by `amount` calendar days (negative to go back). */
export function shiftDateKey(key: string, amount: number): string {
  return formatDateKey(addDays(parseDateKey(key), amount));
}

/** Today's date as a `YYYY-MM-DD` key, in the local calendar day. */
export function getTodayDateKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The current calendar month as a `YYYY-MM` key, in the local calendar day. */
export function getCurrentMonthKey(now: Date = new Date()): string {
  return getTodayDateKey(now).slice(0, 7);
}

/** Shifts a `YYYY-MM` key by `amount` calendar months (negative to go back). */
export function shiftMonthKey(monthKey: string, amount: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** The first and last day (inclusive) of a `YYYY-MM` month, as date keys. */
export function getMonthDateRange(monthKey: string): { from: string; to: string } {
  const [year, month] = monthKey.split("-").map(Number);
  const from = `${monthKey}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const to = `${monthKey}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

/** Every day in a `YYYY-MM` month as `YYYY-MM-DD` keys, in order. */
export function getDaysInMonth(monthKey: string): string[] {
  const { from, to } = getMonthDateRange(monthKey);
  const days: string[] = [];
  let cursor = from;
  while (cursor <= to) {
    days.push(cursor);
    cursor = shiftDateKey(cursor, 1);
  }
  return days;
}

/** A human-readable label for a `YYYY-MM` key, e.g. "July 2026". */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
