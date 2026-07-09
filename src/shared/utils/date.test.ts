import { describe, expect, it } from "vitest";

import {
  formatDateKey,
  formatMonthLabel,
  getCurrentMonthKey,
  getDaysInMonth,
  getMonthDateRange,
  getTodayDateKey,
  parseDateKey,
  shiftDateKey,
  shiftMonthKey,
} from "./date";

describe("parseDateKey / formatDateKey", () => {
  it("round-trips a date key", () => {
    expect(formatDateKey(parseDateKey("2026-07-08"))).toBe("2026-07-08");
  });
});

describe("shiftDateKey", () => {
  it("shifts backward across a month boundary", () => {
    expect(shiftDateKey("2026-07-01", -1)).toBe("2026-06-30");
  });

  it("shifts forward across a year boundary", () => {
    expect(shiftDateKey("2025-12-31", 1)).toBe("2026-01-01");
  });

  it("returns the same key when shifting by 0", () => {
    expect(shiftDateKey("2026-07-08", 0)).toBe("2026-07-08");
  });
});

describe("getTodayDateKey", () => {
  it("formats a given date as YYYY-MM-DD", () => {
    expect(getTodayDateKey(new Date(2026, 6, 8))).toBe("2026-07-08");
  });

  it("zero-pads single-digit months and days", () => {
    expect(getTodayDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("getCurrentMonthKey", () => {
  it("formats a given date as YYYY-MM", () => {
    expect(getCurrentMonthKey(new Date(2026, 6, 8))).toBe("2026-07");
  });
});

describe("shiftMonthKey", () => {
  it("shifts backward across a year boundary", () => {
    expect(shiftMonthKey("2026-01", -1)).toBe("2025-12");
  });

  it("shifts forward across a year boundary", () => {
    expect(shiftMonthKey("2025-12", 1)).toBe("2026-01");
  });

  it("returns the same key when shifting by 0", () => {
    expect(shiftMonthKey("2026-07", 0)).toBe("2026-07");
  });
});

describe("getMonthDateRange", () => {
  it("returns the first and last day of a 31-day month", () => {
    expect(getMonthDateRange("2026-07")).toEqual({ from: "2026-07-01", to: "2026-07-31" });
  });

  it("returns the correct last day for February in a leap year", () => {
    expect(getMonthDateRange("2024-02")).toEqual({ from: "2024-02-01", to: "2024-02-29" });
  });

  it("returns the correct last day for February in a non-leap year", () => {
    expect(getMonthDateRange("2026-02")).toEqual({ from: "2026-02-01", to: "2026-02-28" });
  });
});

describe("getDaysInMonth", () => {
  it("returns every day in order for a 30-day month", () => {
    const days = getDaysInMonth("2026-04");
    expect(days).toHaveLength(30);
    expect(days[0]).toBe("2026-04-01");
    expect(days[29]).toBe("2026-04-30");
  });
});

describe("formatMonthLabel", () => {
  it("formats a month key as a human-readable label", () => {
    expect(formatMonthLabel("2026-07")).toBe("July 2026");
  });
});
