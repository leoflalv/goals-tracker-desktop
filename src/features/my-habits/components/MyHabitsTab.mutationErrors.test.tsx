import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as useGetHabitsModule from "@/features/habits/actions/useGetHabits";
import * as habitService from "@/features/habits/services/habitService";

import { MyHabitsTab } from "./MyHabitsTab";

const mockAddToast = vi.fn();

vi.mock("@/shared/store/toastStore", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock("@/features/habits/actions/useGetHabits");

vi.mock("@/features/habits/services/habitService", () => ({
  createHabit: vi.fn(),
  updateHabit: vi.fn(),
  deleteHabit: vi.fn(),
  habitsQueryKey: ["habits"],
}));

const habitA = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00Z",
  deletedAt: null,
};

function renderTab(habits: typeof habitA[] = []) {
  vi.mocked(useGetHabitsModule.useGetHabits).mockReturnValue({
    habits,
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(<MyHabitsTab />, { wrapper: Wrapper });
}

beforeEach(() => vi.clearAllMocks());

describe("MyHabitsTab mutation error handling", () => {
  it("shows a toast when creating a habit fails", async () => {
    vi.mocked(habitService.createHabit).mockRejectedValue(new Error("name cannot be empty"));
    renderTab([]);

    await userEvent.type(screen.getByLabelText("Habit name"), "Cold shower");
    await userEvent.click(screen.getByRole("button", { name: "Add habit" }));

    await vi.waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith({
        message: "name cannot be empty",
        variant: "error",
      }),
    );
  });

  it("shows a toast when updating a habit fails", async () => {
    vi.mocked(habitService.updateHabit).mockRejectedValue(new Error("habit not found"));
    renderTab([habitA]);

    await userEvent.click(screen.getByRole("button", { name: 'Edit "Morning workout"' }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await vi.waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith({
        message: "habit not found",
        variant: "error",
      }),
    );
  });

  it("shows a toast when deleting a habit fails", async () => {
    vi.mocked(habitService.deleteHabit).mockRejectedValue(new Error("habit not found"));
    renderTab([habitA]);

    await userEvent.click(screen.getByRole("button", { name: 'Delete "Morning workout"' }));
    await userEvent.click(
      screen.getByRole("button", { name: 'Confirm delete "Morning workout"' }),
    );

    await vi.waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith({
        message: "habit not found",
        variant: "error",
      }),
    );
  });
});
