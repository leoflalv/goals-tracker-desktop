import { useState } from "react";

import { Button, ColorPicker, Input } from "@/shared/components";

const DEFAULT_COLOR = "#3b82f6";

type HabitFormProps = {
  initialName?: string;
  initialColor?: string;
  submitLabel: string;
  loading: boolean;
  onSubmit: (name: string, color: string) => void;
  onCancel?: () => void;
};

export function HabitForm({
  initialName = "",
  initialColor = DEFAULT_COLOR,
  submitLabel,
  loading,
  onSubmit,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), color);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Habit name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          aria-label="Habit name"
          className="flex-1"
        />
        <ColorPicker
          value={color}
          onChange={setColor}
          disabled={loading}
          aria-label="Habit color"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !name.trim()} size="sm">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
