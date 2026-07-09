import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { listen } from "@tauri-apps/api/event";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHabitsChangedListener } from "./useHabitsChangedListener";

const mockUnlisten = vi.fn();

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { Wrapper, queryClient };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listen).mockResolvedValue(mockUnlisten);
});

describe("useHabitsChangedListener", () => {
  it("subscribes to the habits:changed event on mount", async () => {
    const { Wrapper } = createWrapper();
    renderHook(() => useHabitsChangedListener(), { wrapper: Wrapper });

    await waitFor(() => expect(listen).toHaveBeenCalledWith("habits:changed", expect.any(Function)));
  });

  it("invalidates habits and completions queries when the event fires", async () => {
    const { Wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    renderHook(() => useHabitsChangedListener(), { wrapper: Wrapper });

    await waitFor(() => expect(listen).toHaveBeenCalled());
    const handler = vi.mocked(listen).mock.calls[0][1];
    handler({ event: "habits:changed", id: 0, payload: undefined });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["habits"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["completions"] });
  });

  it("unlistens on unmount", async () => {
    const { Wrapper } = createWrapper();
    const { unmount } = renderHook(() => useHabitsChangedListener(), { wrapper: Wrapper });

    await waitFor(() => expect(listen).toHaveBeenCalled());
    unmount();
    await waitFor(() => expect(mockUnlisten).toHaveBeenCalled());
  });
});
