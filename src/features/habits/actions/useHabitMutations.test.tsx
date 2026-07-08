import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as habitService from "../services/habitService";
import { useCreateHabit } from "./useCreateHabit";
import { useDeleteHabit } from "./useDeleteHabit";
import { useToggleHabitCompletion } from "./useToggleHabitCompletion";
import { useUpdateHabit } from "./useUpdateHabit";

vi.mock("@/shared/store/toastStore", () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock("../services/habitService", () => ({
  createHabit: vi.fn(),
  updateHabit: vi.fn(),
  deleteHabit: vi.fn(),
  toggleHabitCompletion: vi.fn(),
  habitsQueryKey: ["habits"],
  completionsQueryKey: ["completions"],
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
    defaultOptions: { mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { Wrapper, queryClient };
}

beforeEach(() => vi.clearAllMocks());

describe("useCreateHabit", () => {
  it("calls onSuccess and invalidates the habits query when creation succeeds", async () => {
    vi.mocked(habitService.createHabit).mockResolvedValue(mockHabit);
    const { Wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useCreateHabit(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.createHabit("Morning workout", "#ff0000", onSuccess);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.error).toBeNull();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["habits"] });
  });

  it("sets error and does not call onSuccess when creation fails", async () => {
    vi.mocked(habitService.createHabit).mockRejectedValue(new Error("name cannot be empty"));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateHabit(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.createHabit("", "#ff0000", onSuccess);
    await waitFor(() => expect(result.current.error).toBe("name cannot be empty"));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe("useUpdateHabit", () => {
  it("calls onSuccess and invalidates the habits query when update succeeds", async () => {
    vi.mocked(habitService.updateHabit).mockResolvedValue(mockHabit);
    const { Wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUpdateHabit(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.updateHabit("habit-1", { name: "New name" }, onSuccess);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.error).toBeNull();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["habits"] });
  });

  it("sets error and does not call onSuccess when update fails", async () => {
    vi.mocked(habitService.updateHabit).mockRejectedValue(
      new Error("habit unknown-id not found"),
    );
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useUpdateHabit(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.updateHabit("unknown-id", { name: "X" }, onSuccess);
    await waitFor(() => expect(result.current.error).toBe("habit unknown-id not found"));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe("useDeleteHabit", () => {
  it("calls onSuccess and invalidates the habits query when deletion succeeds", async () => {
    vi.mocked(habitService.deleteHabit).mockResolvedValue(undefined);
    const { Wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useDeleteHabit(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.deleteHabit("habit-1", onSuccess);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.error).toBeNull();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["habits"] });
  });

  it("sets error and does not call onSuccess when deletion fails", async () => {
    vi.mocked(habitService.deleteHabit).mockRejectedValue(
      new Error("habit unknown-id not found"),
    );
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDeleteHabit(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.deleteHabit("unknown-id", onSuccess);
    await waitFor(() => expect(result.current.error).toBe("habit unknown-id not found"));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe("useToggleHabitCompletion", () => {
  it("calls onSuccess and invalidates the completions query when toggling succeeds", async () => {
    vi.mocked(habitService.toggleHabitCompletion).mockResolvedValue({ completed: true });
    const { Wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useToggleHabitCompletion(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.toggleCompletion("habit-1", "2026-07-08", onSuccess);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.error).toBeNull();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["completions"] });
  });

  it("sets error and does not call onSuccess when toggling fails", async () => {
    vi.mocked(habitService.toggleHabitCompletion).mockRejectedValue(new Error("db error"));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useToggleHabitCompletion(), { wrapper: Wrapper });
    const onSuccess = vi.fn();

    result.current.toggleCompletion("habit-1", "2026-07-08", onSuccess);
    await waitFor(() => expect(result.current.error).toBe("db error"));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
