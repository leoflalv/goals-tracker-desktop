import { useQuery } from "@tanstack/react-query";

import type { Goal } from "@/features/goals/domain";

import { getGoals, goalsQueryKey } from "../services/goalService";

export function useGetGoals() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: goalsQueryKey,
    queryFn: getGoals,
  });

  return {
    goals: (data ?? []) as Goal[],
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => { void refetch(); },
  };
}
