import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import { deleteGoal as deleteGoalService, goalsQueryKey } from "../services/goalService";

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteGoalService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
    onError: (err) => addToast({ message: err.message, variant: "error" }),
  });

  function deleteGoal(id: number, onSuccess?: () => void) {
    mutate({ id }, { onSuccess: () => onSuccess?.() });
  }

  return { deleteGoal, loading: isPending, error: error?.message ?? null };
}
