import type { Habit, HabitCompletion } from "@/features/habits/domain";
import { Spinner } from "@/shared/components";

import { HabitRow } from "./HabitRow";

type HabitListProps = {
  habits: Habit[];
  completions: HabitCompletion[];
  loading: boolean;
  today: string;
};

export function HabitList({ habits, completions, loading, today }: HabitListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-white/40">
        No habits yet. Add one from the manage window.
      </p>
    );
  }

  return (
    <ul className="flex max-h-[35rem] flex-col gap-2 overflow-y-auto">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitRow habit={habit} completions={completions} today={today} />
        </li>
      ))}
    </ul>
  );
}
