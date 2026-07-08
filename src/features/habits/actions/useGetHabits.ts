import { useQuery } from "@tanstack/react-query";

import type { Habit } from "@/features/habits/domain";

import { getHabits, habitsQueryKey } from "../services/habitService";

export function useGetHabits() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: habitsQueryKey,
    queryFn: getHabits,
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
