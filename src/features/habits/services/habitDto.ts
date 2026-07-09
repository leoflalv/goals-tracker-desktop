import { z } from "zod";

import type { Habit } from "@/features/habits/domain";

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  sort_order: z.number(),
  created_at: z.string(),
  deleted_at: z.string().nullable(),
});

export type HabitDto = z.infer<typeof HabitSchema>;

export function toHabit(dto: HabitDto): Habit {
  return {
    id: dto.id,
    name: dto.name,
    color: dto.color,
    sortOrder: dto.sort_order,
    createdAt: dto.created_at,
    deletedAt: dto.deleted_at,
  };
}
