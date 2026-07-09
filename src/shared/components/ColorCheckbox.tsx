import { InputHTMLAttributes } from "react";

type ColorCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  color: string;
};

/**
 * A checkbox whose checked/unchecked appearance is fully custom-drawn (not
 * native OS chrome tinted via `accent-color`). WebKit repaints native
 * checkboxes/radios in a flat inactive style whenever their window isn't key
 * (see CLAUDE.md) — since this app runs unfocused most of the time, we own
 * every pixel here instead of relying on `accent-color`.
 */
export function ColorCheckbox({ color, checked, className, ...props }: ColorCheckboxProps) {
  return (
    <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        className={`absolute inset-0 h-full w-full cursor-pointer appearance-none rounded border-2 transition-colors ${className ?? ""}`}
        style={{ backgroundColor: checked ? color : "transparent", borderColor: color }}
        {...props}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none absolute h-2.5 w-2.5 ${checked ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
