import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("shows the completed/total fraction", () => {
    render(<ProgressBar completed={3} total={5} />);
    expect(screen.getByText("3 / 5")).toBeInTheDocument();
  });

  it("reflects the percentage via aria-valuenow", () => {
    render(<ProgressBar completed={3} total={5} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
  });

  it("shows 0% when there are no habits", () => {
    render(<ProgressBar completed={0} total={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
