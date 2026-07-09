import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { listen } from "@tauri-apps/api/event";

import { completionsQueryKey, habitsQueryKey } from "../services/habitService";

const HABITS_CHANGED_EVENT = "habits:changed";

export function useHabitsChangedListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let cancelled = false;

    listen(HABITS_CHANGED_EVENT, () => {
      queryClient.invalidateQueries({ queryKey: habitsQueryKey });
      queryClient.invalidateQueries({ queryKey: completionsQueryKey });
    }).then((fn) => {
      if (cancelled) {
        fn();
        return;
      }
      unlisten = fn;
    });

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [queryClient]);
}
