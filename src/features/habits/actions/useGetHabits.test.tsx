import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as habitService from "../services/habitService";
import { useGetHabits } from "./useGetHabits";

vi.mock("../services/habitService", () => ({
  getHabits: vi.fn(),
  habitsQueryKey: ["habits"],
}));

const mockHabit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2024-01-01T00:00:00Z",
  deletedAt: null,
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

describe("useGetHabits", () => {
  it("starts loading and resolves with habits on success", async () => {
    vi.mocked(habitService.getHabits).mockResolvedValue([mockHabit]);
    const { result } = renderHook(() => useGetHabits(), { wrapper: createWrapper() });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.habits).toEqual([mockHabit]);
    expect(result.current.error).toBeNull();
  });

  it("sets error and keeps habits empty on failure", async () => {
    vi.mocked(habitService.getHabits).mockRejectedValue(new Error("fetch failed"));
    const { result } = renderHook(() => useGetHabits(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("fetch failed");
    expect(result.current.habits).toEqual([]);
  });

  it("refetch re-queries the service", async () => {
    vi.mocked(habitService.getHabits).mockResolvedValue([mockHabit]);
    const { result } = renderHook(() => useGetHabits(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.refetch();
    await waitFor(() => expect(habitService.getHabits).toHaveBeenCalledTimes(2));
  });
});
