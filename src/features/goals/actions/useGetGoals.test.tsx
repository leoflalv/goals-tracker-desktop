import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as goalService from "../services/goalService";

import { useGetGoals } from "./useGetGoals";

vi.mock("../services/goalService", () => ({
  getGoals: vi.fn(),
  goalsQueryKey: ["goals"],
}));

const mockGoal = {
  id: 1,
  title: "Buy milk",
  description: null,
  completed: false,
  createdAt: "2024-01-01T00:00:00Z",
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

beforeEach(() => vi.clearAllMocks());

describe("useGetGoals", () => {
  it("starts loading and resolves with goals on success", async () => {
    vi.mocked(goalService.getGoals).mockResolvedValue([mockGoal]);
    const { result } = renderHook(() => useGetGoals(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.goals).toEqual([mockGoal]);
    expect(result.current.error).toBeNull();
  });

  it("sets error and keeps goals empty on failure", async () => {
    vi.mocked(goalService.getGoals).mockRejectedValue(new Error("fetch failed"));
    const { result } = renderHook(() => useGetGoals(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("fetch failed");
    expect(result.current.goals).toEqual([]);
  });

  it("refetch re-queries the service", async () => {
    vi.mocked(goalService.getGoals).mockResolvedValue([mockGoal]);
    const { result } = renderHook(() => useGetGoals(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.refetch();
    await waitFor(() => expect(goalService.getGoals).toHaveBeenCalledTimes(2));
  });
});
