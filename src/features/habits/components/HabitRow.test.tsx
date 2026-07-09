import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Habit, HabitCompletion } from "@/features/habits/domain";

import { HabitRow } from "./HabitRow";

const mockToggleCompletion = vi.fn();

vi.mock("@/features/habits/actions/useToggleHabitCompletion", () => ({
  useToggleHabitCompletion: () => ({
    toggleCompletion: mockToggleCompletion,
    loading: false,
    error: null,
  }),
}));

const TODAY = "2026-07-08";

const habit: Habit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

function completion(completedOn: string): HabitCompletion {
  return { id: `c-${completedOn}`, habitId: habit.id, completedOn };
}

beforeEach(() => vi.clearAllMocks());

describe("HabitRow", () => {
  it("renders the habit name", () => {
    render(<HabitRow habit={habit} completions={[]} today={TODAY} />);
    expect(screen.getByText("Morning workout")).toBeInTheDocument();
  });

  it("renders 7 week dots", () => {
    const { container } = render(
      <HabitRow habit={habit} completions={[]} today={TODAY} />,
    );
    expect(container.querySelectorAll("span.h-2.w-2")).toHaveLength(7);
  });

  it("shows the streak count", () => {
    const completions = [completion("2026-07-08"), completion("2026-07-07")];
    render(<HabitRow habit={habit} completions={completions} today={TODAY} />);
    expect(screen.getByLabelText("2 day streak")).toBeInTheDocument();
  });

  it("checkbox reflects completion for today", () => {
    render(
      <HabitRow habit={habit} completions={[completion(TODAY)]} today={TODAY} />,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("checkbox is unchecked when today is not completed", () => {
    render(<HabitRow habit={habit} completions={[]} today={TODAY} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("calls toggleCompletion with habit id and today's date when clicked", async () => {
    render(<HabitRow habit={habit} completions={[]} today={TODAY} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(mockToggleCompletion).toHaveBeenCalledWith("habit-1", TODAY);
  });
});
