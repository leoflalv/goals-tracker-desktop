import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import { deleteHabit as deleteHabitService, habitsQueryKey } from "../services/habitService";

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteHabitService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: habitsQueryKey }),
    onError: (err) => addToast({ message: err.message, variant: "error" }),
  });

  function deleteHabit(id: string, onSuccess?: () => void) {
    mutate({ id }, { onSuccess: () => onSuccess?.() });
  }

  return { deleteHabit, loading: isPending, error: error?.message ?? null };
}
