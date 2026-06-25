import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded border bg-surface px-3 py-2 text-sm text-white placeholder-muted outline-none transition-colors focus:ring-2 ${
        error
          ? "border-error focus:ring-error"
          : "border-border focus:ring-primary"
      } ${className ?? ""}`}
      {...props}
    />
  );
}
