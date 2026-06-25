import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";

export const goalsQueryKey = ["goals"] as const;

import type { Goal } from "@/features/goals/domain";
import { tryCatch } from "@/shared/utils/result";

import { GoalSchema, toGoal } from "./goalDto";

export async function getGoals(): Promise<Goal[]> {
  const [raw, err] = await tryCatch(invoke<unknown>("get_goals"));
  if (err) throw err;

  const parsed = z.array(GoalSchema).safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return parsed.data.map(toGoal);
}

export async function createGoal(
  title: string,
  description?: string,
): Promise<Goal> {
  const [raw, err] = await tryCatch(
    invoke<unknown>("create_goal", { title, description }),
  );
  if (err) throw err;

  const parsed = GoalSchema.safeParse(raw);
  if (!parsed.success) throw parsed.error;

  return toGoal(parsed.data);
}

export async function updateGoal(
  id: number,
  completed: boolean,
  title?: string,
  description?: string,
): Promise<void> {
  const [, err] = await tryCatch(
    invoke<void>("update_goal", { id, completed, title, description }),
  );
  if (err) throw err;
}

export async function deleteGoal(id: number): Promise<void> {
  const [, err] = await tryCatch(invoke<void>("delete_goal", { id }));
  if (err) throw err;
}
