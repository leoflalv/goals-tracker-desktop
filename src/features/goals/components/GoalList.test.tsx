import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Goal } from "@/features/goals/domain";

import { GoalList } from "./GoalList";

vi.mock("./GoalCard", () => ({
  GoalCard: ({ goal }: { goal: Goal }) => <div data-testid="goal-card">{goal.title}</div>,
}));

const makeGoal = (id: number): Goal => ({
  id,
  title: `Goal ${id}`,
  description: null,
  completed: false,
  createdAt: "2024-01-01T00:00:00Z",
});

describe("GoalList", () => {
  it("shows a spinner while loading", () => {
    render(<GoalList goals={[]} loading={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows empty state message when there are no goals", () => {
    render(<GoalList goals={[]} loading={false} />);
    expect(screen.getByText(/no goals yet/i)).toBeInTheDocument();
  });

  it("renders one GoalCard per goal", () => {
    const goals = [makeGoal(1), makeGoal(2), makeGoal(3)];
    render(<GoalList goals={goals} loading={false} />);
    expect(screen.getAllByTestId("goal-card")).toHaveLength(3);
  });

  it("does not show spinner or empty state when goals are present", () => {
    render(<GoalList goals={[makeGoal(1)]} loading={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/no goals yet/i)).not.toBeInTheDocument();
  });
});
