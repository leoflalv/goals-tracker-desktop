import { useState } from "react";

import { useCreateHabit } from "@/features/habits/actions/useCreateHabit";
import { useGetHabits } from "@/features/habits/actions/useGetHabits";
import { useUpdateHabit } from "@/features/habits/actions/useUpdateHabit";
import { Spinner } from "@/shared/components";

import { HabitForm } from "./HabitForm";
import { HabitListItem } from "./HabitListItem";

export function MyHabitsTab() {
  const { habits, loading } = useGetHabits();
  const { createHabit, loading: creating } = useCreateHabit();
  const { updateHabit, loading: updating } = useUpdateHabit();
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  const editingHabit = habits.find((h) => h.id === editingHabitId) ?? null;

  function handleCreate(name: string, color: string) {
    createHabit(name, color);
  }

  function handleUpdate(name: string, color: string) {
    if (!editingHabit) return;
    updateHabit(editingHabit.id, { name, color }, () => setEditingHabitId(null));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {habits.length === 0 ? (
        <p className="py-6 text-center text-sm text-white/40">
          No habits yet. Add one below.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {habits.map((habit) => (
            <li key={habit.id}>
              <HabitListItem habit={habit} onEdit={() => setEditingHabitId(habit.id)} />
            </li>
          ))}
        </ul>
      )}

      {editingHabit ? (
        <HabitForm
          key={editingHabit.id}
          initialName={editingHabit.name}
          initialColor={editingHabit.color}
          submitLabel="Save"
          loading={updating}
          onSubmit={handleUpdate}
          onCancel={() => setEditingHabitId(null)}
        />
      ) : (
        <HabitForm submitLabel="Add habit" loading={creating} onSubmit={handleCreate} />
      )}
    </div>
  );
}
