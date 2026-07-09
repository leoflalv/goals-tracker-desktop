import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Habit } from "@/features/habits/domain";
import * as habitService from "@/features/habits/services/habitService";

import { HabitRow } from "./HabitRow";

const mockAddToast = vi.fn();

vi.mock("@/shared/store/toastStore", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock("@/features/habits/services/habitService", () => ({
  toggleHabitCompletion: vi.fn(),
  completionsQueryKey: ["completions"],
}));

const habit: Habit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => vi.clearAllMocks());

describe("HabitRow toggle error handling", () => {
  it("shows a toast when the completion toggle fails", async () => {
    vi.mocked(habitService.toggleHabitCompletion).mockRejectedValue(
      new Error("db error"),
    );

    render(<HabitRow habit={habit} completions={[]} today="2026-07-08" />, {
      wrapper: createWrapper(),
    });

    await userEvent.click(screen.getByRole("checkbox"));

    expect(mockAddToast).toHaveBeenCalledWith({
      message: "db error",
      variant: "error",
    });
  });
});
