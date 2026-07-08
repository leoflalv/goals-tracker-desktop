import { useQuery } from "@tanstack/react-query";

import type { HabitCompletion } from "@/features/habits/domain";

import { completionsQueryKey, getCompletions } from "../services/habitService";

export function useGetCompletions(from: string, to: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...completionsQueryKey, from, to],
    queryFn: () => getCompletions(from, to),
  });

  return {
    completions: (data ?? []) as HabitCompletion[],
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => {
      void refetch();
    },
  };
}
