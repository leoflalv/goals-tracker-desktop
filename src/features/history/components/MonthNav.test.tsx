import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MonthNav } from "./MonthNav";

describe("MonthNav", () => {
  it("renders a human-readable month label", () => {
    render(
      <MonthNav monthKey="2026-07" onPrevious={vi.fn()} onNext={vi.fn()} canGoNext={true} />,
    );
    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("calls onPrevious when the previous control is clicked", async () => {
    const onPrevious = vi.fn();
    render(
      <MonthNav monthKey="2026-07" onPrevious={onPrevious} onNext={vi.fn()} canGoNext={true} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Previous month" }));
    expect(onPrevious).toHaveBeenCalled();
  });

  it("calls onNext when the next control is clicked and enabled", async () => {
    const onNext = vi.fn();
    render(
      <MonthNav monthKey="2026-06" onPrevious={vi.fn()} onNext={onNext} canGoNext={true} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(onNext).toHaveBeenCalled();
  });

  it("disables the next control when canGoNext is false", () => {
    render(
      <MonthNav monthKey="2026-07" onPrevious={vi.fn()} onNext={vi.fn()} canGoNext={false} />,
    );
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
  });
});
