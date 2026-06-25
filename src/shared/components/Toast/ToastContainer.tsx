import { useToastStore } from "@/shared/store/toastStore";

const variantClasses = {
  success: "bg-surface border-l-4 border-l-primary",
  error: "bg-surface border-l-4 border-l-error",
  info: "bg-surface border-l-4 border-l-secondary",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-4 rounded px-4 py-3 text-sm text-white shadow-lg ${variantClasses[toast.variant]}`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/50 hover:text-white"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
