import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HabitForm } from "./HabitForm";

describe("HabitForm", () => {
  it("calls onSubmit with the entered name and color", async () => {
    const onSubmit = vi.fn();
    render(<HabitForm submitLabel="Add habit" loading={false} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Habit name"), "Morning workout");
    await userEvent.click(screen.getByRole("button", { name: "Add habit" }));

    expect(onSubmit).toHaveBeenCalledWith("Morning workout", expect.any(String));
  });

  it("does not call onSubmit when the name is empty", async () => {
    const onSubmit = vi.fn();
    render(<HabitForm submitLabel="Add habit" loading={false} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: "Add habit" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("pre-fills name and color from initial values", () => {
    render(
      <HabitForm
        initialName="Read"
        initialColor="#00ff00"
        submitLabel="Save"
        loading={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Habit name")).toHaveValue("Read");
    expect(screen.getByLabelText("Habit color")).toHaveValue("#00ff00");
  });

  it("shows a cancel button when onCancel is provided and calls it", async () => {
    const onCancel = vi.fn();
    render(
      <HabitForm submitLabel="Save" loading={false} onSubmit={vi.fn()} onCancel={onCancel} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("disables the submit button while loading", () => {
    render(<HabitForm submitLabel="Add habit" loading={true} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Add habit" })).toBeDisabled();
  });
});
