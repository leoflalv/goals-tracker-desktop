import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders children", () => {
    render(<Chip selected={false}>Morning workout</Chip>);
    expect(screen.getByText("Morning workout")).toBeInTheDocument();
  });

  it("sets aria-pressed true when selected", () => {
    render(<Chip selected={true}>Morning workout</Chip>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("sets aria-pressed false when not selected", () => {
    render(<Chip selected={false}>Morning workout</Chip>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      <Chip selected={false} onClick={onClick}>
        Morning workout
      </Chip>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("applies the color as the border color", () => {
    render(
      <Chip selected={false} color="#ff0000">
        Morning workout
      </Chip>,
    );
    expect(screen.getByRole("button")).toHaveStyle({ borderColor: "#ff0000" });
  });
});
