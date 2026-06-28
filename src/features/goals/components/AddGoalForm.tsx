import { useState } from "react";

import { useCreateGoal } from "@/features/goals/actions/useCreateGoal";
import { Button, Input } from "@/shared/components";

export function AddGoalForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { createGoal, loading } = useCreateGoal();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createGoal(title.trim(), description.trim() || undefined, () => {
      setTitle("");
      setDescription("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
      <Input
        placeholder="New goal…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        aria-label="Goal title"
      />
      <Input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
        aria-label="Goal description"
      />
      <Button type="submit" disabled={loading || !title.trim()} size="sm">
        Add
      </Button>
    </form>
  );
}
