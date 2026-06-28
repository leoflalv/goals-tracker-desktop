import { useDeleteGoal } from "@/features/goals/actions/useDeleteGoal";
import { useUpdateGoal } from "@/features/goals/actions/useUpdateGoal";
import type { Goal } from "@/features/goals/domain";
import { Button } from "@/shared/components";

type GoalCardProps = {
  goal: Goal;
};

export function GoalCard({ goal }: GoalCardProps) {
  const { updateGoal } = useUpdateGoal();
  const { deleteGoal } = useDeleteGoal();

  return (
    <div className="flex items-start gap-3 rounded-lg bg-surface p-3">
      <input
        type="checkbox"
        checked={goal.completed}
        onChange={(e) =>
          updateGoal(
            goal.id,
            e.target.checked,
            goal.title,
            goal.description ?? undefined,
          )
        }
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
        aria-label={`Mark "${goal.title}" as ${goal.completed ? "incomplete" : "complete"}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${goal.completed ? "text-white/40 line-through" : "text-white"}`}
        >
          {goal.title}
        </p>
        {goal.description !== null && (
          <p className="mt-0.5 text-xs text-white/50">{goal.description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteGoal(goal.id)}
        aria-label={`Delete "${goal.title}"`}
        className="shrink-0 text-white/30 hover:text-red-400"
      >
        ✕
      </Button>
    </div>
  );
}
