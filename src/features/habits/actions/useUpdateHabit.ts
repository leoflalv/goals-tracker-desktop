import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import { habitsQueryKey, updateHabit as updateHabitService } from "../services/habitService";

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      id,
      changes,
    }: {
      id: string;
      changes: { name?: string; color?: string };
    }) => updateHabitService(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: habitsQueryKey }),
    onError: (err) => addToast({ message: err.message, variant: "error" }),
  });

  function updateHabit(
    id: string,
    changes: { name?: string; color?: string },
    onSuccess?: () => void,
  ) {
    mutate({ id, changes }, { onSuccess: () => onSuccess?.() });
  }

  return { updateHabit, loading: isPending, error: error?.message ?? null };
}
