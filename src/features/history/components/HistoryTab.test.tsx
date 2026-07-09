import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as useGetAllHabitsModule from "@/features/habits/actions/useGetAllHabits";
import * as useGetCompletionsModule from "@/features/habits/actions/useGetCompletions";
import { getCurrentMonthKey } from "@/shared/utils/date";

import { HistoryTab } from "./HistoryTab";

vi.mock("@/features/habits/actions/useGetAllHabits");
vi.mock("@/features/habits/actions/useGetCompletions");

const activeHabit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

const deletedHabit = {
  id: "habit-2",
  name: "Cold shower",
  color: "#00ff00",
  sortOrder: 1,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: "2026-06-01T00:00:00Z",
};

function completion(habitId: string, completedOn: string) {
  return { id: `${habitId}-${completedOn}`, habitId, completedOn };
}

function currentMonthDay(day: string) {
  return `${getCurrentMonthKey()}-${day}`;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useGetAllHabitsModule.useGetAllHabits).mockReturnValue({
    habits: [activeHabit],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  vi.mocked(useGetCompletionsModule.useGetCompletions).mockReturnValue({
    completions: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
});

describe("HistoryTab", () => {
  it("shows a spinner while completions are loading", () => {
    vi.mocked(useGetCompletionsModule.useGetCompletions).mockReturnValue({
      completions: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });
    render(<HistoryTab />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders each habit's completions as colored dots in the month grid", () => {
    vi.mocked(useGetCompletionsModule.useGetCompletions).mockReturnValue({
      completions: [completion("habit-1", currentMonthDay("08"))],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<HistoryTab />);
    const cell = screen.getByLabelText(`${currentMonthDay("08")}: 1 habit completed`);
    expect(cell.querySelector("span[aria-hidden]")).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("disables next-month navigation while viewing the current month", () => {
    render(<HistoryTab />);
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
  });

  it("requests a different date range and re-enables next after navigating back", async () => {
    render(<HistoryTab />);

    const initialCalls = vi.mocked(useGetCompletionsModule.useGetCompletions).mock.calls;
    const initialCallArgs = initialCalls[initialCalls.length - 1];

    await userEvent.click(screen.getByRole("button", { name: "Previous month" }));

    expect(screen.getByRole("button", { name: "Next month" })).not.toBeDisabled();
    const laterCalls = vi.mocked(useGetCompletionsModule.useGetCompletions).mock.calls;
    const afterClickArgs = laterCalls[laterCalls.length - 1];
    expect(afterClickArgs).not.toEqual(initialCallArgs);
  });

  it("moves forward a month again after navigating back", async () => {
    render(<HistoryTab />);

    await userEvent.click(screen.getByRole("button", { name: "Previous month" }));
    await userEvent.click(screen.getByRole("button", { name: "Next month" }));

    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
  });

  it("filters the month view to a single selected habit", async () => {
    vi.mocked(useGetAllHabitsModule.useGetAllHabits).mockReturnValue({
      habits: [activeHabit, { ...activeHabit, id: "habit-3", name: "Read 30 min" }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    vi.mocked(useGetCompletionsModule.useGetCompletions).mockReturnValue({
      completions: [
        completion("habit-1", currentMonthDay("08")),
        completion("habit-3", currentMonthDay("08")),
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<HistoryTab />);

    await userEvent.click(screen.getByRole("button", { name: "Morning workout" }));

    expect(
      screen.getByLabelText(`${currentMonthDay("08")}: 1 habit completed`),
    ).toBeInTheDocument();
  });

  it("shows all habits again after clearing the filter", async () => {
    vi.mocked(useGetAllHabitsModule.useGetAllHabits).mockReturnValue({
      habits: [activeHabit, { ...activeHabit, id: "habit-3", name: "Read 30 min" }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    vi.mocked(useGetCompletionsModule.useGetCompletions).mockReturnValue({
      completions: [
        completion("habit-1", currentMonthDay("08")),
        completion("habit-3", currentMonthDay("08")),
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<HistoryTab />);

    const chip = screen.getByRole("button", { name: "Morning workout" });
    await userEvent.click(chip);
    await userEvent.click(chip);

    expect(
      screen.getByLabelText(`${currentMonthDay("08")}: 2 habits completed`),
    ).toBeInTheDocument();
  });

  it("still shows a deleted habit's completions and filter chip for the month they occurred", () => {
    vi.mocked(useGetAllHabitsModule.useGetAllHabits).mockReturnValue({
      habits: [activeHabit, deletedHabit],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    vi.mocked(useGetCompletionsModule.useGetCompletions).mockReturnValue({
      completions: [completion("habit-2", currentMonthDay("05"))],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<HistoryTab />);

    expect(screen.getByRole("button", { name: "Cold shower" })).toBeInTheDocument();
    const cell = screen.getByLabelText(`${currentMonthDay("05")}: 1 habit completed`);
    expect(cell.querySelector("span[aria-hidden]")).toHaveStyle({ backgroundColor: "#00ff00" });
  });
});
