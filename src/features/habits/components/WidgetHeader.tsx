import { getCurrentWindow } from "@tauri-apps/api/window";

import { useOpenManageWindow } from "@/features/manage-window/actions/useOpenManageWindow";
import { Button } from "@/shared/components";

export function WidgetHeader() {
  const { openManageWindow } = useOpenManageWindow();

  function handleDragStart(e: React.MouseEvent) {
    e.preventDefault();
    void getCurrentWindow().startDragging();
  }

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onMouseDown={handleDragStart}
      className="mb-2 flex h-6 cursor-grab items-center justify-between active:cursor-grabbing"
    >
      <span className="text-xs font-medium text-white/70">{dateLabel}</span>
      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          openManageWindow();
        }}
        aria-label="Open manage window"
        className="p-0 text-white/50 hover:bg-transparent hover:text-white"
      >
        ⚙
      </Button>
    </div>
  );
}
