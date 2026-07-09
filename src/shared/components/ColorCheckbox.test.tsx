import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ColorCheckbox } from "./ColorCheckbox";

describe("ColorCheckbox", () => {
  it("renders a checkbox input", () => {
    render(<ColorCheckbox color="#ff0000" checked={false} onChange={vi.fn()} aria-label="Done" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("reflects the checked state", () => {
    render(<ColorCheckbox color="#ff0000" checked={true} onChange={vi.fn()} aria-label="Done" />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("fills the background with the given color when checked", () => {
    render(<ColorCheckbox color="#ff0000" checked={true} onChange={vi.fn()} aria-label="Done" />);
    expect(screen.getByRole("checkbox")).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("keeps a transparent background when unchecked", () => {
    render(<ColorCheckbox color="#ff0000" checked={false} onChange={vi.fn()} aria-label="Done" />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.style.backgroundColor).toBe("transparent");
  });

  it("always uses the given color for the border, regardless of checked state", () => {
    const { rerender } = render(
      <ColorCheckbox color="#ff0000" checked={false} onChange={vi.fn()} aria-label="Done" />,
    );
    expect(screen.getByRole("checkbox")).toHaveStyle({ borderColor: "#ff0000" });

    rerender(<ColorCheckbox color="#ff0000" checked={true} onChange={vi.fn()} aria-label="Done" />);
    expect(screen.getByRole("checkbox")).toHaveStyle({ borderColor: "#ff0000" });
  });

  it("calls onChange when clicked", async () => {
    const onChange = vi.fn();
    render(<ColorCheckbox color="#ff0000" checked={false} onChange={onChange} aria-label="Done" />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalled();
  });
});
