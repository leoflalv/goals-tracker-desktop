import type { Goal } from "@/features/goals/domain";
import { Spinner } from "@/shared/components";

import { GoalCard } from "./GoalCard";

type GoalListProps = {
  goals: Goal[];
  loading: boolean;
};

export function GoalList({ goals, loading }: GoalListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-white/40">
        No goals yet. Add one below.
      </p>
    );
  }

  return (
    <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
      {goals.map((goal) => (
        <li key={goal.id}>
          <GoalCard goal={goal} />
        </li>
      ))}
    </ul>
  );
}
