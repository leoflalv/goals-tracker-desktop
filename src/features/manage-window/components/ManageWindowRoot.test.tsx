import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ManageWindowRoot } from "./ManageWindowRoot";

vi.mock("@/features/my-habits/components/MyHabitsTab", () => ({
  MyHabitsTab: () => <div data-testid="my-habits-tab">My Habits Content</div>,
}));

vi.mock("@/features/history/components/HistoryTab", () => ({
  HistoryTab: () => <div data-testid="history-tab">History Content</div>,
}));

describe("ManageWindowRoot", () => {
  it("selects the My Habits tab by default", () => {
    render(<ManageWindowRoot />);
    expect(screen.getByTestId("my-habits-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("history-tab")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "My Habits" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("switches to History and hides My Habits when clicked", async () => {
    render(<ManageWindowRoot />);

    await userEvent.click(screen.getByRole("tab", { name: "History" }));

    expect(screen.getByTestId("history-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("my-habits-tab")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "History" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "My Habits" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });
});
