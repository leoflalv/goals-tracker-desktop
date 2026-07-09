import { useQuery } from "@tanstack/react-query";

import type { Habit } from "@/features/habits/domain";

import { allHabitsQueryKey, getAllHabits } from "../services/habitService";

/** Includes soft-deleted habits, for History's filter chips and month view. */
export function useGetAllHabits() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: allHabitsQueryKey,
    queryFn: getAllHabits,
  });

  return {
    habits: (data ?? []) as Habit[],
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => {
      void refetch();
    },
  };
}
