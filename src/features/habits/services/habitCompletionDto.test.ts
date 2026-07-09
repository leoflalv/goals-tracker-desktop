import { describe, expect, it } from "vitest";

import {
  HabitCompletionSchema,
  ToggleCompletionResultSchema,
  toHabitCompletion,
} from "./habitCompletionDto";

const validRaw = {
  id: "completion-1",
  habit_id: "habit-1",
  completed_on: "2026-07-08",
};

describe("HabitCompletionSchema.safeParse", () => {
  it("succeeds for a valid shape", () => {
    expect(HabitCompletionSchema.safeParse(validRaw).success).toBe(true);
  });

  it("fails when habit_id is missing", () => {
    const { id, completed_on } = validRaw;
    expect(HabitCompletionSchema.safeParse({ id, completed_on }).success).toBe(false);
  });

  it("fails when completed_on is not a string", () => {
    expect(
      HabitCompletionSchema.safeParse({ ...validRaw, completed_on: 20260708 }).success,
    ).toBe(false);
  });
});

describe("toHabitCompletion", () => {
  it("maps all fields and renames snake_case to camelCase", () => {
    const dto = HabitCompletionSchema.safeParse(validRaw);
    expect(dto.success).toBe(true);
    if (!dto.success) return;

    expect(toHabitCompletion(dto.data)).toEqual({
      id: "completion-1",
      habitId: "habit-1",
      completedOn: "2026-07-08",
    });
  });
});

describe("ToggleCompletionResultSchema.safeParse", () => {
  it("succeeds for a valid shape", () => {
    expect(ToggleCompletionResultSchema.safeParse({ completed: true }).success).toBe(true);
  });

  it("fails when completed is not a boolean", () => {
    expect(ToggleCompletionResultSchema.safeParse({ completed: "true" }).success).toBe(false);
  });
});
