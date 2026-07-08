import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as habitService from "../services/habitService";
import { useGetCompletions } from "./useGetCompletions";

vi.mock("../services/habitService", () => ({
  getCompletions: vi.fn(),
  completionsQueryKey: ["completions"],
}));

const mockCompletion = {
  id: "completion-1",
  habitId: "habit-1",
  completedOn: "2026-07-08",
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => vi.clearAllMocks());

describe("useGetCompletions", () => {
  it("invokes getCompletions with from/to and resolves with completions", async () => {
    vi.mocked(habitService.getCompletions).mockResolvedValue([mockCompletion]);
    const { result } = renderHook(() => useGetCompletions("2026-07-01", "2026-07-08"), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(habitService.getCompletions).toHaveBeenCalledWith("2026-07-01", "2026-07-08");
    expect(result.current.completions).toEqual([mockCompletion]);
    expect(result.current.error).toBeNull();
  });

  it("sets error and keeps completions empty on failure", async () => {
    vi.mocked(habitService.getCompletions).mockRejectedValue(new Error("fetch failed"));
    const { result } = renderHook(() => useGetCompletions("2026-07-01", "2026-07-08"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("fetch failed");
    expect(result.current.completions).toEqual([]);
  });
});
