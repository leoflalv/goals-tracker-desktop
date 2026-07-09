import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Habit } from "@/features/habits/domain";

import { HabitFilterChips } from "./HabitFilterChips";

const habitA: Habit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

const deletedHabit: Habit = {
  id: "habit-2",
  name: "Cold shower",
  color: "#00ff00",
  sortOrder: 1,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: "2026-06-01T00:00:00Z",
};

describe("HabitFilterChips", () => {
  it("renders nothing when there are no habits", () => {
    const { container } = render(
      <HabitFilterChips habits={[]} selectedHabitIds={new Set()} onToggle={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a chip for each habit, including deleted ones", () => {
    render(
      <HabitFilterChips
        habits={[habitA, deletedHabit]}
        selectedHabitIds={new Set()}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByText("Morning workout")).toBeInTheDocument();
    expect(screen.getByText("Cold shower")).toBeInTheDocument();
  });

  it("marks a habit's chip as selected", () => {
    render(
      <HabitFilterChips
        habits={[habitA]}
        selectedHabitIds={new Set(["habit-1"])}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Morning workout" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onToggle with the habit id when clicked", async () => {
    const onToggle = vi.fn();
    render(
      <HabitFilterChips habits={[habitA]} selectedHabitIds={new Set()} onToggle={onToggle} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Morning workout" }));
    expect(onToggle).toHaveBeenCalledWith("habit-1");
  });
});
