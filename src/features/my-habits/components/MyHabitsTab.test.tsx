import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as useCreateHabitModule from "@/features/habits/actions/useCreateHabit";
import * as useGetHabitsModule from "@/features/habits/actions/useGetHabits";
import * as useUpdateHabitModule from "@/features/habits/actions/useUpdateHabit";

import { MyHabitsTab } from "./MyHabitsTab";

const mockCreateHabit = vi.fn();
const mockUpdateHabit = vi.fn((_id: string, _changes: unknown, onSuccess?: () => void) =>
  onSuccess?.(),
);
const mockDeleteHabit = vi.fn();

vi.mock("@/features/habits/actions/useGetHabits");
vi.mock("@/features/habits/actions/useCreateHabit");
vi.mock("@/features/habits/actions/useUpdateHabit");
vi.mock("@/features/habits/actions/useDeleteHabit", () => ({
  useDeleteHabit: () => ({ deleteHabit: mockDeleteHabit, loading: false, error: null }),
}));

const habitA = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

const habitB = {
  id: "habit-2",
  name: "Read 30 min",
  color: "#00ff00",
  sortOrder: 1,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useCreateHabitModule.useCreateHabit).mockReturnValue({
    createHabit: mockCreateHabit,
    loading: false,
    error: null,
  });
  vi.mocked(useUpdateHabitModule.useUpdateHabit).mockReturnValue({
    updateHabit: mockUpdateHabit,
    loading: false,
    error: null,
  });
});

describe("MyHabitsTab", () => {
  it("shows a spinner while loading", () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the empty state when there are no habits", () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });

  it("lists each habit with its color swatch, name, edit and delete buttons", () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [habitA, habitB],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);
    expect(screen.getByText("Morning workout")).toBeInTheDocument();
    expect(screen.getByText("Read 30 min")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: 'Edit "Morning workout"' })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: 'Delete "Read 30 min"' })).toBeInTheDocument();
  });

  it("creates a habit with the entered name and color", async () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);

    await userEvent.type(screen.getByLabelText("Habit name"), "Cold shower");
    await userEvent.click(screen.getByRole("button", { name: "Add habit" }));

    expect(mockCreateHabit).toHaveBeenCalledWith("Cold shower", expect.any(String));
  });

  it("does not create a habit when the name is empty", async () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);

    await userEvent.click(screen.getByRole("button", { name: "Add habit" }));
    expect(mockCreateHabit).not.toHaveBeenCalled();
  });

  it("opens an edit form pre-filled with the habit's name and color, and updates on submit", async () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [habitA],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);

    await userEvent.click(screen.getByRole("button", { name: 'Edit "Morning workout"' }));

    expect(screen.getByLabelText("Habit name")).toHaveValue("Morning workout");
    expect(screen.getByLabelText("Habit color")).toHaveValue("#ff0000");

    await userEvent.clear(screen.getByLabelText("Habit name"));
    await userEvent.type(screen.getByLabelText("Habit name"), "Morning run");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockUpdateHabit).toHaveBeenCalledWith(
      "habit-1",
      { name: "Morning run", color: "#ff0000" },
      expect.any(Function),
    );
  });

  it("returns to the create form after a successful edit", async () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [habitA],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);

    await userEvent.click(screen.getByRole("button", { name: 'Edit "Morning workout"' }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("button", { name: "Add habit" })).toBeInTheDocument();
  });

  it("deletes a habit after confirming", async () => {
    vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
      habits: [habitA],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<MyHabitsTab />);

    await userEvent.click(screen.getByRole("button", { name: 'Delete "Morning workout"' }));
    await userEvent.click(
      screen.getByRole("button", { name: 'Confirm delete "Morning workout"' }),
    );

    expect(mockDeleteHabit).toHaveBeenCalledWith("habit-1");
  });
});
