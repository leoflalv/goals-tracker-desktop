import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type { Goal } from "@/features/goals/domain";

import { GoalCard } from "./GoalCard";

const mockUpdateGoal = vi.fn();
const mockDeleteGoal = vi.fn();

vi.mock("@/features/goals/actions/useUpdateGoal", () => ({
  useUpdateGoal: () => ({ updateGoal: mockUpdateGoal, error: null }),
}));

vi.mock("@/features/goals/actions/useDeleteGoal", () => ({
  useDeleteGoal: () => ({ deleteGoal: mockDeleteGoal, error: null }),
}));

const baseGoal: Goal = {
  id: 1,
  title: "Buy milk",
  description: null,
  completed: false,
  createdAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => vi.clearAllMocks());

describe("GoalCard", () => {
  it("renders the goal title", () => {
    render(<GoalCard goal={baseGoal} />);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("does not render description when null", () => {
    render(<GoalCard goal={{ ...baseGoal, description: null }} />);
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<GoalCard goal={{ ...baseGoal, description: "From the store" }} />);
    expect(screen.getByText("From the store")).toBeInTheDocument();
  });

  it("calls updateGoal with completed: true when checkbox is checked", async () => {
    render(<GoalCard goal={baseGoal} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(mockUpdateGoal).toHaveBeenCalledWith(1, true, "Buy milk", undefined);
  });

  it("calls updateGoal with completed: false when checkbox is unchecked", async () => {
    render(<GoalCard goal={{ ...baseGoal, completed: true }} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(mockUpdateGoal).toHaveBeenCalledWith(1, false, "Buy milk", undefined);
  });

  it("calls deleteGoal with the goal id when delete button is clicked", async () => {
    render(<GoalCard goal={baseGoal} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(mockDeleteGoal).toHaveBeenCalledWith(1);
  });
});
