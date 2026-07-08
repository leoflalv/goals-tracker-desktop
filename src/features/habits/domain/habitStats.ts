import { addDays, formatDateKey, parseDateKey } from "@/shared/utils/date";

import type { Habit } from "./Habit";
import type { HabitCompletion } from "./HabitCompletion";

/** Consecutive completed days ending on `today`; 0 if `today` itself isn't completed. */
export function getStreak(
  habitId: string,
  completions: readonly HabitCompletion[],
  today: string,
): number {
  const completedDates = new Set(
    completions.filter((c) => c.habitId === habitId).map((c) => c.completedOn),
  );

  let streak = 0;
  let cursor = parseDateKey(today);
  while (completedDates.has(formatDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Completion state for the 7 days ending on `today`, oldest first. */
export function getWeekDots(
  habitId: string,
  completions: readonly HabitCompletion[],
  today: string,
): boolean[] {
  const completedDates = new Set(
    completions.filter((c) => c.habitId === habitId).map((c) => c.completedOn),
  );
  const todayDate = parseDateKey(today);

  const dots: boolean[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    dots.push(completedDates.has(formatDateKey(addDays(todayDate, -offset))));
  }
  return dots;
}

/** Fraction of the given habits completed on `today`. */
export function getDailyProgress(
  habits: readonly Habit[],
  completions: readonly HabitCompletion[],
  today: string,
): { completed: number; total: number } {
  const completedHabitIds = new Set(
    completions.filter((c) => c.completedOn === today).map((c) => c.habitId),
  );
  const completed = habits.filter((h) => completedHabitIds.has(h.id)).length;
  return { completed, total: habits.length };
}
