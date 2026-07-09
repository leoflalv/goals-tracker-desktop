import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Habit } from "@/features/habits/domain";

import { HabitList } from "./HabitList";

vi.mock("./HabitRow", () => ({
  HabitRow: ({ habit }: { habit: Habit }) => (
    <div data-testid="habit-row">{habit.name}</div>
  ),
}));

function makeHabit(id: string): Habit {
  return {
    id,
    name: `Habit ${id}`,
    color: "#ff0000",
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00Z",
    deletedAt: null,
  };
}

const TODAY = "2026-07-08";

describe("HabitList", () => {
  it("shows a spinner while loading", () => {
    render(<HabitList habits={[]} completions={[]} loading={true} today={TODAY} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows empty state message when there are no habits", () => {
    render(<HabitList habits={[]} completions={[]} loading={false} today={TODAY} />);
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });

  it("does not show spinner or empty state when habits are present", () => {
    render(
      <HabitList
        habits={[makeHabit("1")]}
        completions={[]}
        loading={false}
        today={TODAY}
      />,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/no habits yet/i)).not.toBeInTheDocument();
  });

  it("renders one row per habit when there are fewer than 10", () => {
    const habits = Array.from({ length: 6 }, (_, i) => makeHabit(String(i)));
    render(<HabitList habits={habits} completions={[]} loading={false} today={TODAY} />);
    expect(screen.getAllByTestId("habit-row")).toHaveLength(6);
  });

  it("renders every row (scrollable) when there are more than 10", () => {
    const habits = Array.from({ length: 14 }, (_, i) => makeHabit(String(i)));
    const { container } = render(
      <HabitList habits={habits} completions={[]} loading={false} today={TODAY} />,
    );
    expect(screen.getAllByTestId("habit-row")).toHaveLength(14);
    expect(container.querySelector("ul")).toHaveClass("overflow-y-auto");
  });
});
