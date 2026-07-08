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
