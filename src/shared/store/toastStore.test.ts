import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useToastStore } from "./toastStore";

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("toastStore", () => {
  it("addToast adds a toast with a generated id", () => {
    useToastStore.getState().addToast({ message: "Saved", variant: "success" });
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Saved");
    expect(toasts[0].variant).toBe("success");
    expect(toasts[0].id).toBeDefined();
  });

  it("removeToast removes the toast with the given id", () => {
    useToastStore.getState().addToast({ message: "Saved", variant: "success" });
    const { toasts } = useToastStore.getState();
    useToastStore.getState().removeToast(toasts[0].id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("auto-dismisses the toast after 3 seconds", () => {
    useToastStore.getState().addToast({ message: "Done", variant: "info" });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(3000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("does not dismiss before 3 seconds", () => {
    useToastStore.getState().addToast({ message: "Done", variant: "info" });
    vi.advanceTimersByTime(2999);
    expect(useToastStore.getState().toasts).toHaveLength(1);
  });
});
