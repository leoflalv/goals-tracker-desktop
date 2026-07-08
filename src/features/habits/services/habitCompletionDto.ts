import { z } from "zod";

import type { HabitCompletion } from "@/features/habits/domain";

export const HabitCompletionSchema = z.object({
  id: z.string(),
  habit_id: z.string(),
  completed_on: z.string(),
});

export type HabitCompletionDto = z.infer<typeof HabitCompletionSchema>;

export function toHabitCompletion(dto: HabitCompletionDto): HabitCompletion {
  return {
    id: dto.id,
    habitId: dto.habit_id,
    completedOn: dto.completed_on,
  };
}

export const ToggleCompletionResultSchema = z.object({
  completed: z.boolean(),
});

export type ToggleCompletionResultDto = z.infer<typeof ToggleCompletionResultSchema>;
