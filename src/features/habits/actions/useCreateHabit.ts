import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import { createHabit as createHabitService, habitsQueryKey } from "../services/habitService";

export function useCreateHabit() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createHabitService(name, color),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: habitsQueryKey }),
    onError: (err) => addToast({ message: err.message, variant: "error" }),
  });

  function createHabit(name: string, color: string, onSuccess?: () => void) {
    mutate({ name, color }, { onSuccess: () => onSuccess?.() });
  }

  return { createHabit, loading: isPending, error: error?.message ?? null };
}
