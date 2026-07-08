import { invoke } from "@tauri-apps/api/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createHabit,
  deleteHabit,
  getCompletions,
  getHabits,
  toggleHabitCompletion,
  updateHabit,
} from "./habitService";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

const mockInvoke = vi.mocked(invoke);

const rawHabit = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sort_order: 0,
  created_at: "2024-01-01T00:00:00Z",
  deleted_at: null,
};

const rawCompletion = {
  id: "completion-1",
  habit_id: "habit-1",
  completed_on: "2026-07-08",
};

beforeEach(() => vi.clearAllMocks());

describe("getHabits", () => {
  it("invokes get_habits and returns camelCase-mapped habits", async () => {
    mockInvoke.mockResolvedValueOnce([rawHabit]);
    const habits = await getHabits();
    expect(mockInvoke).toHaveBeenCalledWith("get_habits");
    expect(habits[0].sortOrder).toBe(0);
    expect(habits[0]).not.toHaveProperty("sort_order");
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("db error");
    await expect(getHabits()).rejects.toThrow("db error");
  });

  it("throws when the backend returns an invalid shape", async () => {
    mockInvoke.mockResolvedValueOnce([{ ...rawHabit, sort_order: "not-a-number" }]);
    await expect(getHabits()).rejects.toThrow();
  });
});

describe("createHabit", () => {
  it("invokes create_habit with name and color", async () => {
    mockInvoke.mockResolvedValueOnce(rawHabit);
    await createHabit("Morning workout", "#ff0000");
    expect(mockInvoke).toHaveBeenCalledWith("create_habit", {
      name: "Morning workout",
      color: "#ff0000",
    });
  });

  it("returns the mapped habit", async () => {
    mockInvoke.mockResolvedValueOnce(rawHabit);
    const habit = await createHabit("Morning workout", "#ff0000");
    expect(habit.sortOrder).toBe(0);
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("name cannot be empty");
    await expect(createHabit("", "#ff0000")).rejects.toThrow("name cannot be empty");
  });
});

describe("updateHabit", () => {
  it("invokes update_habit with the changed fields", async () => {
    mockInvoke.mockResolvedValueOnce({ ...rawHabit, name: "New name", color: "#0000ff" });
    await updateHabit("habit-1", { name: "New name", color: "#0000ff" });
    expect(mockInvoke).toHaveBeenCalledWith("update_habit", {
      id: "habit-1",
      name: "New name",
      color: "#0000ff",
    });
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("habit unknown-id not found");
    await expect(updateHabit("unknown-id", { name: "X" })).rejects.toThrow(
      "habit unknown-id not found",
    );
  });
});

describe("deleteHabit", () => {
  it("invokes delete_habit with the correct id", async () => {
    mockInvoke.mockResolvedValueOnce(undefined);
    await deleteHabit("habit-1");
    expect(mockInvoke).toHaveBeenCalledWith("delete_habit", { id: "habit-1" });
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("habit unknown-id not found");
    await expect(deleteHabit("unknown-id")).rejects.toThrow("habit unknown-id not found");
  });
});

describe("toggleHabitCompletion", () => {
  it("invokes toggle_habit_completion with habitId and date", async () => {
    mockInvoke.mockResolvedValueOnce({ completed: true });
    const result = await toggleHabitCompletion("habit-1", "2026-07-08");
    expect(mockInvoke).toHaveBeenCalledWith("toggle_habit_completion", {
      habitId: "habit-1",
      date: "2026-07-08",
    });
    expect(result).toEqual({ completed: true });
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("db error");
    await expect(toggleHabitCompletion("habit-1", "2026-07-08")).rejects.toThrow("db error");
  });
});

describe("getCompletions", () => {
  it("invokes get_completions with from/to and returns mapped completions", async () => {
    mockInvoke.mockResolvedValueOnce([rawCompletion]);
    const completions = await getCompletions("2026-07-01", "2026-07-08");
    expect(mockInvoke).toHaveBeenCalledWith("get_completions", {
      from: "2026-07-01",
      to: "2026-07-08",
    });
    expect(completions[0].habitId).toBe("habit-1");
    expect(completions[0]).not.toHaveProperty("habit_id");
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("db error");
    await expect(getCompletions("2026-07-01", "2026-07-08")).rejects.toThrow("db error");
  });
});
