import type { Habit, HabitCompletion } from "@/features/habits/domain";
import { getDaysInMonth } from "@/shared/utils/date";

type MonthGridProps = {
  monthKey: string;
  completions: HabitCompletion[];
  habitsById: Map<string, Habit>;
};

export function MonthGrid({ monthKey, completions, habitsById }: MonthGridProps) {
  const days = getDaysInMonth(monthKey);

  const completionsByDay = new Map<string, HabitCompletion[]>();
  for (const completion of completions) {
    const forDay = completionsByDay.get(completion.completedOn) ?? [];
    forDay.push(completion);
    completionsByDay.set(completion.completedOn, forDay);
  }

  return (
    <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`${monthKey} completions`}>
      {days.map((day) => {
        const dayCompletions = completionsByDay.get(day) ?? [];
        const dayNumber = Number(day.slice(-2));

        return (
          <div
            key={day}
            role="gridcell"
            aria-label={`${day}: ${dayCompletions.length} habit${
              dayCompletions.length === 1 ? "" : "s"
            } completed`}
            className="flex flex-col items-center gap-1 rounded bg-surface p-1"
          >
            <span className="text-[10px] text-white/50">{dayNumber}</span>
            <div className="flex min-h-[6px] flex-wrap justify-center gap-0.5">
              {dayCompletions.map((completion) => (
                <span
                  key={completion.id}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: habitsById.get(completion.habitId)?.color ?? "#666" }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
