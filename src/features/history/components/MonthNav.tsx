import { Button } from "@/shared/components";
import { formatMonthLabel } from "@/shared/utils/date";

type MonthNavProps = {
  monthKey: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
};

export function MonthNav({ monthKey, onPrevious, onNext, canGoNext }: MonthNavProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={onPrevious} aria-label="Previous month">
        ‹
      </Button>
      <span className="text-sm font-medium text-white">{formatMonthLabel(monthKey)}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next month"
      >
        ›
      </Button>
    </div>
  );
}
