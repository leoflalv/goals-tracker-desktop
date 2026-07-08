import { useToggleHabitCompletion } from "@/features/habits/actions/useToggleHabitCompletion";
import type { Habit, HabitCompletion } from "@/features/habits/domain";
import { getStreak, getWeekDots } from "@/features/habits/domain";

type HabitRowProps = {
  habit: Habit;
  completions: HabitCompletion[];
  today: string;
};

export function HabitRow({ habit, completions, today }: HabitRowProps) {
  const { toggleCompletion } = useToggleHabitCompletion();
  const streak = getStreak(habit.id, completions, today);
  const weekDots = getWeekDots(habit.id, completions, today);
  const isCompletedToday = weekDots[weekDots.length - 1];

  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
      <input
        type="checkbox"
        checked={isCompletedToday}
        onChange={() => toggleCompletion(habit.id, today)}
        className="h-4 w-4 shrink-0 cursor-pointer"
        style={{ accentColor: habit.color }}
        aria-label={`Mark "${habit.name}" as ${isCompletedToday ? "not done" : "done"} for today`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{habit.name}</p>
        <div className="mt-1 flex gap-1" aria-hidden="true">
          {weekDots.map((done, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: done ? habit.color : "rgba(255,255,255,0.15)" }}
            />
          ))}
        </div>
      </div>
      <div
        className="flex shrink-0 items-center gap-1 text-xs text-white/60"
        aria-label={`${streak} day streak`}
      >
        <span aria-hidden="true">🔥</span>
        <span>{streak}</span>
      </div>
    </div>
  );
}
