import { describe, expect, it } from "vitest";

import { formatDateKey, getTodayDateKey, parseDateKey, shiftDateKey } from "./date";

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
