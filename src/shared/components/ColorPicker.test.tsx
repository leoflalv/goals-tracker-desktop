import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
  it("renders a color input with the given value", () => {
    render(<ColorPicker value="#ff0000" onChange={vi.fn()} aria-label="Color" />);
    const input = screen.getByLabelText("Color");
    expect(input).toHaveAttribute("type", "color");
    expect(input).toHaveValue("#ff0000");
  });

  it("calls onChange with the new color value", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#ff0000" onChange={onChange} aria-label="Color" />);

    fireEvent.change(screen.getByLabelText("Color"), { target: { value: "#00ff00" } });

    expect(onChange).toHaveBeenCalledWith("#00ff00");
  });

  it("forwards additional props", () => {
    render(<ColorPicker value="#ff0000" onChange={vi.fn()} aria-label="Color" disabled />);
    expect(screen.getByLabelText("Color")).toBeDisabled();
  });
});
