import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as goalService from "../services/goalService";
import { useCreateGoal } from "./useCreateGoal";
import { useDeleteGoal } from "./useDeleteGoal";
import { useUpdateGoal } from "./useUpdateGoal";

vi.mock("@/shared/store/toastStore", () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock("../services/goalService", () => ({
  createGoal: vi.fn(),
  updateGoal: vi.fn(),
  deleteGoal: vi.fn(),
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
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

beforeEach(() => vi.clearAllMocks());

describe("useCreateGoal", () => {
  it("calls onSuccess when creation succeeds", async () => {
    vi.mocked(goalService.createGoal).mockResolvedValue(mockGoal);
    const { result } = renderHook(() => useCreateGoal(), {
      wrapper: createWrapper(),
    });
    const onSuccess = vi.fn();

    result.current.createGoal("Buy milk", undefined, onSuccess);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.error).toBeNull();
  });

  it("sets error and does not call onSuccess when creation fails", async () => {
    vi.mocked(goalService.createGoal).mockRejectedValue(
      new Error("title cannot be empty"),
    );
    const { result } = renderHook(() => useCreateGoal(), {
      wrapper: createWrapper(),
    });
    const onSuccess = vi.fn();

    result.current.createGoal("", undefined, onSuccess);
    await waitFor(() => expect(result.current.error).toBe("title cannot be empty"));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe("useUpdateGoal", () => {
  it("calls onSuccess when update succeeds", async () => {
    vi.mocked(goalService.updateGoal).mockResolvedValue(undefined);
    const { result } = renderHook(() => useUpdateGoal(), {
      wrapper: createWrapper(),
    });
    const onSuccess = vi.fn();

    result.current.updateGoal(1, true, undefined, undefined, onSuccess);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.error).toBeNull();
  });

  it("sets error and does not call onSuccess when update fails", async () => {
    vi.mocked(goalService.updateGoal).mockRejectedValue(
      new Error("goal 999 not found"),
    );
    const { result } = renderHook(() => useUpdateGoal(), {
      wrapper: createWrapper(),
    });
    const onSuccess = vi.fn();

    result.current.updateGoal(999, true, undefined, undefined, onSuccess);
    await waitFor(() => expect(result.current.error).toBe("goal 999 not found"));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe("useDeleteGoal", () => {
  it("calls onSuccess when deletion succeeds", async () => {
    vi.mocked(goalService.deleteGoal).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteGoal(), {
      wrapper: createWrapper(),
    });
    const onSuccess = vi.fn();

    result.current.deleteGoal(1, onSuccess);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.error).toBeNull();
  });

  it("sets error and does not call onSuccess when deletion fails", async () => {
    vi.mocked(goalService.deleteGoal).mockRejectedValue(
      new Error("goal 999 not found"),
    );
    const { result } = renderHook(() => useDeleteGoal(), {
      wrapper: createWrapper(),
    });
    const onSuccess = vi.fn();

    result.current.deleteGoal(999, onSuccess);
    await waitFor(() => expect(result.current.error).toBe("goal 999 not found"));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
