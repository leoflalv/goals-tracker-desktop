import { useState } from "react";

import { useDeleteHabit } from "@/features/habits/actions/useDeleteHabit";
import type { Habit } from "@/features/habits/domain";
import { Button } from "@/shared/components";

type HabitListItemProps = {
  habit: Habit;
  onEdit: () => void;
};

export function HabitListItem({ habit, onEdit }: HabitListItemProps) {
  const { deleteHabit, loading } = useDeleteHabit();
  const [confirming, setConfirming] = useState(false);

  function handleDeleteClick() {
    if (confirming) {
      deleteHabit(habit.id);
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
      <span
        className="h-4 w-4 shrink-0 rounded-full"
        style={{ backgroundColor: habit.color }}
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">{habit.name}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        aria-label={`Edit "${habit.name}"`}
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDeleteClick}
        disabled={loading}
        aria-label={confirming ? `Confirm delete "${habit.name}"` : `Delete "${habit.name}"`}
        className={confirming ? "text-red-400" : "text-white/30 hover:text-red-400"}
      >
        {confirming ? "Confirm?" : "Delete"}
      </Button>
    </div>
  );
}
