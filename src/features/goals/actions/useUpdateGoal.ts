import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import { goalsQueryKey, updateGoal as updateGoalService } from "../services/goalService";

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
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
    onError: (err) => addToast({ message: err.message, variant: "error" }),
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
