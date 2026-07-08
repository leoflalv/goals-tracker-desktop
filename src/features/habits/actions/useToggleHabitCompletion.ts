import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import {
  completionsQueryKey,
  toggleHabitCompletion as toggleHabitCompletionService,
} from "../services/habitService";

export function useToggleHabitCompletion() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      toggleHabitCompletionService(habitId, date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: completionsQueryKey }),
    onError: (err) => addToast({ message: err.message, variant: "error" }),
  });

  function toggleCompletion(habitId: string, date: string, onSuccess?: () => void) {
    mutate({ habitId, date }, { onSuccess: () => onSuccess?.() });
  }

  return { toggleCompletion, loading: isPending, error: error?.message ?? null };
}
