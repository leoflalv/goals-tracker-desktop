import { describe, expect, it } from "vitest";

import { GoalSchema, toGoal } from "./goalDto";

const validRaw = {
  id: 1,
  title: "Buy milk",
  description: "at the store",
  completed: false,
  created_at: "2024-01-01T00:00:00Z",
};

describe("GoalSchema.safeParse", () => {
  it("succeeds for a valid shape", () => {
    expect(GoalSchema.safeParse(validRaw).success).toBe(true);
  });

  it("succeeds when description is null", () => {
    expect(GoalSchema.safeParse({ ...validRaw, description: null }).success).toBe(true);
  });

  it("fails when id is a string", () => {
    expect(GoalSchema.safeParse({ ...validRaw, id: "1" }).success).toBe(false);
  });

  it("fails when title is missing", () => {
    const { title: _, ...rest } = validRaw;
    expect(GoalSchema.safeParse(rest).success).toBe(false);
  });

  it("fails when completed is not a boolean", () => {
    expect(GoalSchema.safeParse({ ...validRaw, completed: 0 }).success).toBe(false);
  });
});

describe("toGoal", () => {
  it("maps all fields and renames created_at to createdAt", () => {
    const dto = GoalSchema.safeParse(validRaw);
    expect(dto.success).toBe(true);
    if (!dto.success) return;

    expect(toGoal(dto.data)).toEqual({
      id: 1,
      title: "Buy milk",
      description: "at the store",
      completed: false,
      createdAt: "2024-01-01T00:00:00Z",
    });
  });

  it("does not include created_at on the result", () => {
    const dto = GoalSchema.safeParse(validRaw);
    if (!dto.success) return;
    expect(toGoal(dto.data)).not.toHaveProperty("created_at");
  });
});
