import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as useGetCompletionsModule from "@/features/habits/actions/useGetCompletions";
import * as useGetHabitsModule from "@/features/habits/actions/useGetHabits";

import { HabitWidget } from "./HabitWidget";

function renderWidget() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <HabitWidget />
    </QueryClientProvider>,
  );
}

const mockListener = vi.fn();

vi.mock("@/features/habits/actions/useGetHabits");
vi.mock("@/features/habits/actions/useGetCompletions");
vi.mock("@/features/habits/actions/useHabitsChangedListener", () => ({
  useHabitsChangedListener: () => mockListener(),
}));
vi.mock("@/features/manage-window/actions/useOpenManageWindow", () => ({
  useOpenManageWindow: () => ({ openManageWindow: vi.fn(), loading: false }),
}));
vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => ({ startDragging: vi.fn() }),
}));

const mockHabit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
    habits: [mockHabit],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  vi.mocked(useGetCompletionsModule.useGetCompletions).mockReturnValue({
    completions: [{ id: "c-1", habitId: "habit-1", completedOn: "2026-07-08" }],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
});

describe("HabitWidget", () => {
  it("subscribes to the habits:changed listener", () => {
    renderWidget();
    expect(mockListener).toHaveBeenCalled();
  });

  it("renders the habit row and progress reflecting today's completions", () => {
    renderWidget();
    expect(screen.getByText("Morning workout")).toBeInTheDocument();
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
  });

  it("shows a spinner while either habits or completions are loading", () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });
    renderWidget();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the empty state when there are no habits", () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    renderWidget();
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });
});
