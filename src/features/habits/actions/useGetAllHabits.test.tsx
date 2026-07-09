import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as habitService from "../services/habitService";
import { useGetAllHabits } from "./useGetAllHabits";

vi.mock("../services/habitService", () => ({
  getAllHabits: vi.fn(),
  allHabitsQueryKey: ["habits", "all"],
}));

const mockHabit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2024-01-01T00:00:00Z",
  deletedAt: "2024-02-01T00:00:00Z",
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

describe("useGetAllHabits", () => {
  it("resolves with all habits, including soft-deleted ones", async () => {
    vi.mocked(habitService.getAllHabits).mockResolvedValue([mockHabit]);
    const { result } = renderHook(() => useGetAllHabits(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.habits).toEqual([mockHabit]);
  });

  it("sets error and keeps habits empty on failure", async () => {
    vi.mocked(habitService.getAllHabits).mockRejectedValue(new Error("fetch failed"));
    const { result } = renderHook(() => useGetAllHabits(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("fetch failed");
    expect(result.current.habits).toEqual([]);
  });
});
