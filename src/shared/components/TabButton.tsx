import { ButtonHTMLAttributes } from "react";

type TabButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
};

export function TabButton({ active, className, ...props }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-b-2 border-primary text-white"
          : "text-white/50 hover:text-white/80"
      } ${className ?? ""}`}
      {...props}
    />
  );
}
