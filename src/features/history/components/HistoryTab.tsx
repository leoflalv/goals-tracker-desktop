import { useState } from "react";

import { useGetAllHabits } from "@/features/habits/actions/useGetAllHabits";
import { useGetCompletions } from "@/features/habits/actions/useGetCompletions";
import { Spinner } from "@/shared/components";
import { getCurrentMonthKey, getMonthDateRange, shiftMonthKey } from "@/shared/utils/date";

import { HabitFilterChips } from "./HabitFilterChips";
import { MonthGrid } from "./MonthGrid";
import { MonthNav } from "./MonthNav";

export function HistoryTab() {
  const [monthKey, setMonthKey] = useState(() => getCurrentMonthKey());
  const [selectedHabitIds, setSelectedHabitIds] = useState<Set<string>>(new Set());

  const { from, to } = getMonthDateRange(monthKey);
  const { habits, loading: habitsLoading } = useGetAllHabits();
  const { completions, loading: completionsLoading } = useGetCompletions(from, to);

  const habitsById = new Map(habits.map((habit) => [habit.id, habit]));
  const habitIdsCompletedThisMonth = new Set(completions.map((c) => c.habitId));
  const chipHabits = habits.filter(
    (habit) => habit.deletedAt === null || habitIdsCompletedThisMonth.has(habit.id),
  );

  const visibleCompletions =
    selectedHabitIds.size === 0
      ? completions
      : completions.filter((c) => selectedHabitIds.has(c.habitId));

  function toggleHabitFilter(habitId: string) {
    setSelectedHabitIds((prev) => {
      const next = new Set(prev);
      if (next.has(habitId)) {
        next.delete(habitId);
      } else {
        next.add(habitId);
      }
      return next;
    });
  }

  return (
    <div>
      <MonthNav
        monthKey={monthKey}
        onPrevious={() => setMonthKey((current) => shiftMonthKey(current, -1))}
        onNext={() => setMonthKey((current) => shiftMonthKey(current, 1))}
        canGoNext={monthKey !== getCurrentMonthKey()}
      />
      <HabitFilterChips
        habits={chipHabits}
        selectedHabitIds={selectedHabitIds}
        onToggle={toggleHabitFilter}
      />
      {habitsLoading || completionsLoading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : (
        <MonthGrid monthKey={monthKey} completions={visibleCompletions} habitsById={habitsById} />
      )}
    </div>
  );
}
