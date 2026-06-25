import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with accessible label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("applies md size classes by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("h-6", "w-6");
  });

  it("applies sm size classes", () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("h-4", "w-4");
  });

  it("applies lg size classes", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("h-8", "w-8");
  });
});
