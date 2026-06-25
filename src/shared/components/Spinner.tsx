type Size = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: Size;
};

const sizeClasses: Record<Size, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-border border-t-white ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
}
