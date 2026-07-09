import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";

import type { Habit, HabitCompletion } from "@/features/habits/domain";
import { tryCatch } from "@/shared/utils/result";

import {
  HabitCompletionSchema,
  ToggleCompletionResultSchema,
  toHabitCompletion,
} from "./habitCompletionDto";
import { HabitSchema, toHabit } from "./habitDto";

export const habitsQueryKey = ["habits"] as const;
export const allHabitsQueryKey = ["habits", "all"] as const;
export const completionsQueryKey = ["completions"] as const;

export async function getHabits(): Promise<Habit[]> {
  const [raw, err] = await tryCatch(invoke<unknown>("get_habits"));
  if (err) throw err;

  const parsed = z.array(HabitSchema).safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return parsed.data.map(toHabit);
}

/** Includes soft-deleted habits, so History can label/color their past completions. */
export async function getAllHabits(): Promise<Habit[]> {
  const [raw, err] = await tryCatch(invoke<unknown>("get_all_habits"));
  if (err) throw err;

  const parsed = z.array(HabitSchema).safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return parsed.data.map(toHabit);
}

export async function createHabit(name: string, color: string): Promise<Habit> {
  const [raw, err] = await tryCatch(
    invoke<unknown>("create_habit", { name, color }),
  );
  if (err) throw err;

  const parsed = HabitSchema.safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return toHabit(parsed.data);
}

export async function updateHabit(
  id: string,
  changes: { name?: string; color?: string },
): Promise<Habit> {
  const [raw, err] = await tryCatch(
    invoke<unknown>("update_habit", {
      id,
      name: changes.name,
      color: changes.color,
    }),
  );
  if (err) throw err;

  const parsed = HabitSchema.safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return toHabit(parsed.data);
}

export async function deleteHabit(id: string): Promise<void> {
  const [, err] = await tryCatch(invoke<void>("delete_habit", { id }));
  if (err) throw err;
}

export async function toggleHabitCompletion(
  habitId: string,
  date: string,
): Promise<{ completed: boolean }> {
  const [raw, err] = await tryCatch(
    invoke<unknown>("toggle_habit_completion", { habitId, date }),
  );
  if (err) throw err;

  const parsed = ToggleCompletionResultSchema.safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return parsed.data;
}

export async function getCompletions(
  from: string,
  to: string,
): Promise<HabitCompletion[]> {
  const [raw, err] = await tryCatch(
    invoke<unknown>("get_completions", { from, to }),
  );
  if (err) throw err;

  const parsed = z.array(HabitCompletionSchema).safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return parsed.data.map(toHabitCompletion);
}
