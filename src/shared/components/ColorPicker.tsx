import { InputHTMLAttributes } from "react";

type ColorPickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange, className, ...props }: ColorPickerProps) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0 ${className ?? ""}`}
      {...props}
    />
  );
}
