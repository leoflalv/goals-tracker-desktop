import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useToastStore } from "@/shared/store/toastStore";

import { ToastContainer } from "./ToastContainer";

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
});

describe("ToastContainer", () => {
  it("renders nothing when there are no toasts", () => {
    const { container } = render(<ToastContainer />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a toast message from the store", () => {
    useToastStore.setState({
      toasts: [{ id: "1", message: "Saved!", variant: "success" }],
    });
    render(<ToastContainer />);
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("renders multiple toasts", () => {
    useToastStore.setState({
      toasts: [
        { id: "1", message: "Saved!", variant: "success" },
        { id: "2", message: "Something went wrong", variant: "error" },
      ],
    });
    render(<ToastContainer />);
    expect(screen.getByText("Saved!")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls removeToast when dismiss button is clicked", async () => {
    useToastStore.setState({
      toasts: [{ id: "1", message: "Saved!", variant: "success" }],
    });
    render(<ToastContainer />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
