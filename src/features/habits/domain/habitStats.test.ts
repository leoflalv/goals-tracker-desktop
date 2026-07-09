import { describe, expect, it } from "vitest";

import type { Habit } from "./Habit";
import type { HabitCompletion } from "./HabitCompletion";
import { getDailyProgress, getStreak, getWeekDots } from "./habitStats";

const TODAY = "2026-07-08";

function completion(habitId: string, completedOn: string): HabitCompletion {
  return { id: `${habitId}-${completedOn}`, habitId, completedOn };
}

function habit(id: string, overrides: Partial<Habit> = {}): Habit {
  return {
    id,
    name: `Habit ${id}`,
    color: "#ff0000",
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    ...overrides,
  };
}

describe("getStreak", () => {
  it("counts consecutive completed days ending today", () => {
    const completions = [
      completion("h1", "2026-07-08"),
      completion("h1", "2026-07-07"),
      completion("h1", "2026-07-06"),
      completion("h1", "2026-07-05"),
      // gap: 2026-07-04 not completed
      completion("h1", "2026-07-01"),
    ];

    expect(getStreak("h1", completions, TODAY)).toBe(4);
  });

  it("returns 0 when today is not completed", () => {
    const completions = [completion("h1", "2026-07-07")];

    expect(getStreak("h1", completions, TODAY)).toBe(0);
  });

  it("ignores completions belonging to other habits", () => {
    const completions = [completion("other-habit", "2026-07-08")];

    expect(getStreak("h1", completions, TODAY)).toBe(0);
  });
});

describe("getWeekDots", () => {
  it("reflects the last 7 days, oldest first", () => {
    const completions = [
      completion("h1", "2026-07-02"),
      completion("h1", "2026-07-04"),
      completion("h1", "2026-07-08"),
    ];

    const dots = getWeekDots("h1", completions, TODAY);

    expect(dots).toHaveLength(7);
    // 07-02, 07-03, 07-04, 07-05, 07-06, 07-07, 07-08
    expect(dots).toEqual([true, false, true, false, false, false, true]);
  });
});

describe("getDailyProgress", () => {
  it("reflects today's completions out of the given habits", () => {
    const habits = [habit("h1"), habit("h2"), habit("h3"), habit("h4"), habit("h5")];
    const completions = [
      completion("h1", TODAY),
      completion("h2", TODAY),
      completion("h3", TODAY),
      completion("h4", "2026-07-01"),
    ];

    expect(getDailyProgress(habits, completions, TODAY)).toEqual({
      completed: 3,
      total: 5,
    });
  });

  it("returns zero completed when no habits are completed today", () => {
    const habits = [habit("h1"), habit("h2")];

    expect(getDailyProgress(habits, [], TODAY)).toEqual({ completed: 0, total: 2 });
  });
});
