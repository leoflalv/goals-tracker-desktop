import { describe, expect, it } from "vitest";

import { HabitSchema, toHabit } from "./habitDto";

const validRaw = {
  id: "habit-1",
  name: "Morning workout",
  color: "#ff0000",
  sort_order: 0,
  created_at: "2024-01-01T00:00:00Z",
  deleted_at: null,
};

describe("HabitSchema.safeParse", () => {
  it("succeeds for a valid shape", () => {
    expect(HabitSchema.safeParse(validRaw).success).toBe(true);
  });

  it("succeeds when deleted_at is a string", () => {
    expect(
      HabitSchema.safeParse({ ...validRaw, deleted_at: "2024-02-01T00:00:00Z" }).success,
    ).toBe(true);
  });

  it("fails when id is a number", () => {
    expect(HabitSchema.safeParse({ ...validRaw, id: 1 }).success).toBe(false);
  });

  it("fails when name is missing", () => {
    const { id, color, sort_order, created_at, deleted_at } = validRaw;
    expect(
      HabitSchema.safeParse({ id, color, sort_order, created_at, deleted_at }).success,
    ).toBe(false);
  });

  it("fails when sort_order is not a number", () => {
    expect(HabitSchema.safeParse({ ...validRaw, sort_order: "0" }).success).toBe(false);
  });
});

describe("toHabit", () => {
  it("maps all fields and renames snake_case to camelCase", () => {
    const dto = HabitSchema.safeParse(validRaw);
    expect(dto.success).toBe(true);
    if (!dto.success) return;

    expect(toHabit(dto.data)).toEqual({
      id: "habit-1",
      name: "Morning workout",
      color: "#ff0000",
      sortOrder: 0,
      createdAt: "2024-01-01T00:00:00Z",
      deletedAt: null,
    });
  });

  it("does not include snake_case fields on the result", () => {
    const dto = HabitSchema.safeParse(validRaw);
    if (!dto.success) return;
    expect(toHabit(dto.data)).not.toHaveProperty("sort_order");
    expect(toHabit(dto.data)).not.toHaveProperty("created_at");
    expect(toHabit(dto.data)).not.toHaveProperty("deleted_at");
  });
});
