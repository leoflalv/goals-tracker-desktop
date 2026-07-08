import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TabButton } from "./TabButton";

describe("TabButton", () => {
  it("renders children with role tab", () => {
    render(<TabButton active={false}>My Habits</TabButton>);
    expect(screen.getByRole("tab", { name: "My Habits" })).toBeInTheDocument();
  });

  it("sets aria-selected true when active", () => {
    render(<TabButton active={true}>My Habits</TabButton>);
    expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "true");
  });

  it("sets aria-selected false when inactive", () => {
    render(<TabButton active={false}>My Habits</TabButton>);
    expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "false");
  });

  it("applies the active indicator classes only when active", () => {
    render(<TabButton active={true}>My Habits</TabButton>);
    expect(screen.getByRole("tab")).toHaveClass("border-primary");
  });

  it("forwards additional props", () => {
    render(
      <TabButton active={false} disabled>
        My Habits
      </TabButton>,
    );
    expect(screen.getByRole("tab")).toBeDisabled();
  });
});
