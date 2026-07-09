import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Habit, HabitCompletion } from "@/features/habits/domain";

import { MonthGrid } from "./MonthGrid";

const habitA: Habit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

function completion(habitId: string, completedOn: string): HabitCompletion {
  return { id: `${habitId}-${completedOn}`, habitId, completedOn };
}

describe("MonthGrid", () => {
  it("renders one cell per day in the month", () => {
    const { container } = render(
      <MonthGrid monthKey="2026-04" completions={[]} habitsById={new Map()} />,
    );
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(30);
  });

  it("shows a colored dot for a habit completed on a given day", () => {
    const habitsById = new Map([[habitA.id, habitA]]);
    render(
      <MonthGrid
        monthKey="2026-07"
        completions={[completion("habit-1", "2026-07-08")]}
        habitsById={habitsById}
      />,
    );
    const cell = screen.getByLabelText("2026-07-08: 1 habit completed");
    const dot = cell.querySelector("span[aria-hidden]");
    expect(dot).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("shows zero completions for a day with no completions", () => {
    render(<MonthGrid monthKey="2026-07" completions={[]} habitsById={new Map()} />);
    expect(screen.getByLabelText("2026-07-01: 0 habits completed")).toBeInTheDocument();
  });
});
