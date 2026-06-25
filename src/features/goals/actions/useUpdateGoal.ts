import { useMutation, useQueryClient } from "@tanstack/react-query";

import { goalsQueryKey, updateGoal as updateGoalService } from "../services/goalService";

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      id,
      completed,
      title,
      description,
    }: {
      id: number;
      completed: boolean;
      title?: string;
      description?: string;
    }) => updateGoalService(id, completed, title, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
  });

  function updateGoal(
    id: number,
    completed: boolean,
    title?: string,
    description?: string,
    onSuccess?: () => void,
  ) {
    mutate({ id, completed, title, description }, { onSuccess: () => onSuccess?.() });
  }

  return { updateGoal, loading: isPending, error: error?.message ?? null };
}
