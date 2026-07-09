import { useGetCompletions } from "@/features/habits/actions/useGetCompletions";
import { useGetHabits } from "@/features/habits/actions/useGetHabits";
import { useHabitsChangedListener } from "@/features/habits/actions/useHabitsChangedListener";
import { getDailyProgress } from "@/features/habits/domain";
import { getTodayDateKey, shiftDateKey } from "@/shared/utils/date";

import { HabitList } from "./HabitList";
import { ProgressBar } from "./ProgressBar";
import { WidgetHeader } from "./WidgetHeader";

const WEEK_DOTS_SPAN_DAYS = 6;

export function HabitWidget() {
  useHabitsChangedListener();

  const today = getTodayDateKey();
  const from = shiftDateKey(today, -WEEK_DOTS_SPAN_DAYS);

  const { habits, loading: habitsLoading } = useGetHabits();
  const { completions, loading: completionsLoading } = useGetCompletions(from, today);

  const { completed, total } = getDailyProgress(habits, completions, today);

  return (
    <div className="flex flex-col rounded-xl bg-black/60 p-3 shadow-xl backdrop-blur-sm">
      <WidgetHeader />
      <ProgressBar completed={completed} total={total} />
      <HabitList
        habits={habits}
        completions={completions}
        loading={habitsLoading || completionsLoading}
        today={today}
      />
    </div>
  );
}
