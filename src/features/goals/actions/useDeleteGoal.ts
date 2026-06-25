import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteGoal as deleteGoalService, goalsQueryKey } from "../services/goalService";

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteGoalService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
  });

  function deleteGoal(id: number, onSuccess?: () => void) {
    mutate({ id }, { onSuccess: () => onSuccess?.() });
  }

  return { deleteGoal, loading: isPending, error: error?.message ?? null };
}
