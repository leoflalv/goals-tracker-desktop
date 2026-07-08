import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Habit } from "@/features/habits/domain";

import { HabitListItem } from "./HabitListItem";

const mockDeleteHabit = vi.fn();

vi.mock("@/features/habits/actions/useDeleteHabit", () => ({
  useDeleteHabit: () => ({ deleteHabit: mockDeleteHabit, loading: false, error: null }),
}));

const habit: Habit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

beforeEach(() => vi.clearAllMocks());

describe("HabitListItem", () => {
  it("renders the habit name, edit button, and delete button", () => {
    render(<HabitListItem habit={habit} onEdit={vi.fn()} />);
    expect(screen.getByText("Morning workout")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: 'Edit "Morning workout"' })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: 'Delete "Morning workout"' })).toBeInTheDocument();
  });

  it("calls onEdit when the edit button is clicked", async () => {
    const onEdit = vi.fn();
    render(<HabitListItem habit={habit} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole("button", { name: 'Edit "Morning workout"' }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("requires a confirm click before calling deleteHabit", async () => {
    render(<HabitListItem habit={habit} onEdit={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: 'Delete "Morning workout"' }));
    expect(mockDeleteHabit).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole("button", { name: 'Confirm delete "Morning workout"' }),
    );
    expect(mockDeleteHabit).toHaveBeenCalledWith("habit-1");
  });
});
