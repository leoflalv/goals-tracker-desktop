import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import { createGoal as createGoalService, goalsQueryKey } from "../services/goalService";

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      title,
      description,
    }: {
      title: string;
      description?: string;
    }) => createGoalService(title, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
    onError: (err) => addToast({ message: err.message, variant: "error" }),
  });

  function createGoal(
    title: string,
    description?: string,
    onSuccess?: () => void,
  ) {
    mutate({ title, description }, { onSuccess: () => onSuccess?.() });
  }

  return { createGoal, loading: isPending, error: error?.message ?? null };
}
