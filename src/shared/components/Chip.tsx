import { ButtonHTMLAttributes } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: boolean;
  color?: string;
};

export function Chip({ selected, color, className, style, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      style={{ ...(color ? { borderColor: color } : {}), ...style }}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        selected
          ? "bg-white/10 text-white"
          : "border-border text-white/50 hover:text-white/80"
      } ${className ?? ""}`}
      {...props}
    />
  );
}
