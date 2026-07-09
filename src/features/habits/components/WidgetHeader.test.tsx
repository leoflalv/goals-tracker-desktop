import { getCurrentWindow } from "@tauri-apps/api/window";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WidgetHeader } from "./WidgetHeader";

const mockStartDragging = vi.fn();
const mockOpenManageWindow = vi.fn();

vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: vi.fn(),
}));

vi.mock("@/features/manage-window/actions/useOpenManageWindow", () => ({
  useOpenManageWindow: () => ({ openManageWindow: mockOpenManageWindow, loading: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentWindow).mockReturnValue({
    startDragging: mockStartDragging,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
});

describe("WidgetHeader", () => {
  it("renders a date label", () => {
    render(<WidgetHeader />);
    expect(screen.getByText(/\w+/)).toBeInTheDocument();
  });

  it("starts dragging the window when the header is pressed", () => {
    render(<WidgetHeader />);
    const header = screen.getByLabelText("Open manage window").closest("div");
    if (header) {
      header.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    }
    expect(mockStartDragging).toHaveBeenCalled();
  });

  it("opens the manage window when the gear icon is clicked, without starting a drag", async () => {
    render(<WidgetHeader />);
    await userEvent.click(screen.getByLabelText("Open manage window"));
    expect(mockOpenManageWindow).toHaveBeenCalled();
    expect(mockStartDragging).not.toHaveBeenCalled();
  });
});
