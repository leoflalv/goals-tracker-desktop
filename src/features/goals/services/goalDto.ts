import { z } from "zod";

import type { Goal } from "@/features/goals/domain";

export const GoalSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  created_at: z.string(),
});

export type GoalDto = z.infer<typeof GoalSchema>;

export function toGoal(dto: GoalDto): Goal {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    completed: dto.completed,
    createdAt: dto.created_at,
  };
}
