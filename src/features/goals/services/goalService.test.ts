import { invoke } from "@tauri-apps/api/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createGoal, deleteGoal, getGoals, updateGoal } from "./goalService";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

const mockInvoke = vi.mocked(invoke);

const rawGoal = {
  id: 1,
  title: "Buy milk",
  description: null,
  completed: false,
  created_at: "2024-01-01T00:00:00Z",
};

beforeEach(() => vi.clearAllMocks());

describe("getGoals", () => {
  it("invokes get_goals and returns camelCase-mapped goals", async () => {
    mockInvoke.mockResolvedValueOnce([rawGoal]);
    const goals = await getGoals();
    expect(mockInvoke).toHaveBeenCalledWith("get_goals");
    expect(goals[0].createdAt).toBe("2024-01-01T00:00:00Z");
    expect(goals[0]).not.toHaveProperty("created_at");
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("db error");
    await expect(getGoals()).rejects.toThrow("db error");
  });

  it("throws when the backend returns an invalid shape", async () => {
    mockInvoke.mockResolvedValueOnce([{ ...rawGoal, id: "not-a-number" }]);
    await expect(getGoals()).rejects.toThrow();
  });
});

describe("createGoal", () => {
  it("invokes create_goal with title and description", async () => {
    mockInvoke.mockResolvedValueOnce(rawGoal);
    await createGoal("Buy milk", "at the store");
    expect(mockInvoke).toHaveBeenCalledWith("create_goal", {
      title: "Buy milk",
      description: "at the store",
    });
  });

  it("returns the mapped goal with createdAt", async () => {
    mockInvoke.mockResolvedValueOnce(rawGoal);
    const goal = await createGoal("Buy milk");
    expect(goal.createdAt).toBe("2024-01-01T00:00:00Z");
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("title cannot be empty");
    await expect(createGoal("")).rejects.toThrow("title cannot be empty");
  });
});

describe("updateGoal", () => {
  it("invokes update_goal with all arguments", async () => {
    mockInvoke.mockResolvedValueOnce(undefined);
    await updateGoal(1, true, "New title", "New desc");
    expect(mockInvoke).toHaveBeenCalledWith("update_goal", {
      id: 1,
      completed: true,
      title: "New title",
      description: "New desc",
    });
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("goal 999 not found");
    await expect(updateGoal(999, true)).rejects.toThrow("goal 999 not found");
  });
});

describe("deleteGoal", () => {
  it("invokes delete_goal with the correct id", async () => {
    mockInvoke.mockResolvedValueOnce(undefined);
    await deleteGoal(1);
    expect(mockInvoke).toHaveBeenCalledWith("delete_goal", { id: 1 });
  });

  it("throws when the backend rejects", async () => {
    mockInvoke.mockRejectedValueOnce("goal 999 not found");
    await expect(deleteGoal(999)).rejects.toThrow("goal 999 not found");
  });
});
