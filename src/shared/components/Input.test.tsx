import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("applies default border classes without error prop", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveClass("border-border");
  });

  it("applies error border classes when error prop is set", () => {
    render(<Input error />);
    expect(screen.getByRole("textbox")).toHaveClass("border-error");
  });

  it("forwards additional props", () => {
    render(<Input type="email" name="email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
  });
});
