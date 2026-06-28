import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AddGoalForm } from "./AddGoalForm";

const mockCreateGoal = vi.fn();

vi.mock("@/features/goals/actions/useCreateGoal", () => ({
  useCreateGoal: () => ({ createGoal: mockCreateGoal, loading: false }),
}));

beforeEach(() => vi.clearAllMocks());

describe("AddGoalForm", () => {
  it("calls createGoal with the title when submitted", async () => {
    render(<AddGoalForm />);
    await userEvent.type(screen.getByRole("textbox", { name: /goal title/i }), "Buy milk");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(mockCreateGoal).toHaveBeenCalledWith("Buy milk", undefined, expect.any(Function));
  });

  it("does not call createGoal when title is empty", async () => {
    render(<AddGoalForm />);
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(mockCreateGoal).not.toHaveBeenCalled();
  });

  it("does not call createGoal when title is only whitespace", async () => {
    render(<AddGoalForm />);
    await userEvent.type(screen.getByRole("textbox", { name: /goal title/i }), "   ");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(mockCreateGoal).not.toHaveBeenCalled();
  });

  it("passes undefined for description when description field is blank", async () => {
    render(<AddGoalForm />);
    await userEvent.type(screen.getByRole("textbox", { name: /goal title/i }), "Buy milk");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(mockCreateGoal).toHaveBeenCalledWith("Buy milk", undefined, expect.any(Function));
  });

  it("passes the description when provided", async () => {
    render(<AddGoalForm />);
    await userEvent.type(screen.getByRole("textbox", { name: /goal title/i }), "Buy milk");
    await userEvent.type(screen.getByRole("textbox", { name: /goal description/i }), "From the store");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(mockCreateGoal).toHaveBeenCalledWith("Buy milk", "From the store", expect.any(Function));
  });

  it("clears the form on success", async () => {
    mockCreateGoal.mockImplementation((_title, _desc, onSuccess) => onSuccess?.());
    render(<AddGoalForm />);
    const titleInput = screen.getByRole("textbox", { name: /goal title/i });
    const descInput = screen.getByRole("textbox", { name: /goal description/i });
    await userEvent.type(titleInput, "Buy milk");
    await userEvent.type(descInput, "From the store");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(titleInput).toHaveValue("");
    expect(descInput).toHaveValue("");
  });
});
