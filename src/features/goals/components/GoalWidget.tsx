import { getCurrentWindow } from "@tauri-apps/api/window";

import { useGetGoals } from "@/features/goals/actions/useGetGoals";

import { AddGoalForm } from "./AddGoalForm";
import { GoalList } from "./GoalList";

export function GoalWidget() {
  const { goals, loading } = useGetGoals();

  function handleDragStart(e: React.MouseEvent) {
    e.preventDefault();
    void getCurrentWindow().startDragging();
  }

  return (
    <div className="flex flex-col rounded-xl bg-black/60 p-3 shadow-xl backdrop-blur-sm">
      <div
        onMouseDown={handleDragStart}
        className="mb-2 flex h-5 cursor-grab items-center justify-center active:cursor-grabbing"
        aria-hidden="true"
      >
        <div className="h-1 w-10 rounded-full bg-white/20" />
      </div>
      <GoalList goals={goals} loading={loading} />
      <AddGoalForm />
    </div>
  );
}
