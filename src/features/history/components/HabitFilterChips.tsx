import type { Habit } from "@/features/habits/domain";
import { Chip } from "@/shared/components";

type HabitFilterChipsProps = {
  habits: Habit[];
  selectedHabitIds: Set<string>;
  onToggle: (habitId: string) => void;
};

export function HabitFilterChips({ habits, selectedHabitIds, onToggle }: HabitFilterChipsProps) {
  if (habits.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {habits.map((habit) => (
        <Chip
          key={habit.id}
          selected={selectedHabitIds.has(habit.id)}
          color={habit.color}
          onClick={() => onToggle(habit.id)}
        >
          {habit.name}
        </Chip>
      ))}
    </div>
  );
}
